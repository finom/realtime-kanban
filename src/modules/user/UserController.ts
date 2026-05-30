import { procedure, prefix, get, put, post, del, operation } from "vovk";
import { z } from "zod";
import { TaskSchema, UserSchema } from "@schemas/index";
import { sessionGuard } from "@/decorators/sessionGuard";
import { BASE_FIELDS } from "@/constants";
import UserService from "./UserService";

@prefix("users")
export default class UserController {
  @operation.tool({
    hidden: true,
  })
  @operation({
    summary: "Get all users",
    description: "Retrieves a list of all users.",
    "x-errorToast": "Failed to retrieve users",
  })
  @get()
  @sessionGuard()
  static getUsers = procedure({
    output: UserSchema.array(),
  }).handle(UserService.getUsers);

  @operation({
    summary: "Find users by ID, full name, or email",
    description:
      "Retrieves users that match the provided ID, full name, or email. Used to search the users when they need to be updated or deleted.",
    "x-errorToast": "Failed to find users",
  })
  @get("search")
  @sessionGuard()
  static findUsers = procedure({
    query: z.object({
      search: z.string().meta({
        description: "Search term for users",
        examples: ["john.doe", "Jane"],
      }),
    }),
    output: UserSchema.array(),
  }).handle(({ vovk }) => UserService.findUsers(vovk.query().search));

  @operation({
    summary: "Create user",
    description: "Creates a new user with the provided details.",
    "x-successToast": "User created successfully",
    "x-errorToast": "Failed to create user",
  })
  @post()
  @sessionGuard()
  static createUser = procedure({
    body: UserSchema.omit(BASE_FIELDS),
    output: UserSchema,
  }).handle(async ({ vovk }) => UserService.createUser(await vovk.body()));

  @operation({
    summary: "Update user",
    description:
      "Updates an existing user with the provided details, such as their email or name.",
    "x-successToast": "User updated successfully",
    "x-errorToast": "Failed to update user",
  })
  @put("{id}")
  @sessionGuard()
  static updateUser = procedure({
    body: UserSchema.omit(BASE_FIELDS).partial(),
    params: UserSchema.pick({ id: true }),
    output: UserSchema,
  }).handle(async ({ vovk }) =>
    UserService.updateUser(vovk.params().id, await vovk.body()),
  );

  @operation({
    summary: "Delete user",
    description: "Deletes a user by ID.",
    "x-successToast": "User deleted successfully",
    "x-errorToast": "Failed to delete user",
  })
  @del("{id}")
  @sessionGuard()
  static deleteUser = procedure({
    params: UserSchema.pick({ id: true }),
    output: UserSchema.partial().extend({
      __isDeleted: z.literal(true),
      tasks: TaskSchema.partial()
        .extend({ __isDeleted: z.literal(true) })
        .array(),
    }),
  }).handle(async ({ vovk }) => UserService.deleteUser(vovk.params().id));
}
