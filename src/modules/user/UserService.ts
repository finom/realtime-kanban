import type { VovkBody, VovkParams } from "vovk";
import type { UserType } from "@schemas/models/User.schema";
import type { TaskType } from "@schemas/models/Task.schema";
import type UserController from "./UserController";
import { EntityType } from "@prisma/client";
import DatabaseService from "../database/DatabaseService";
import EmbeddingService from "../embedding/EmbeddingService";
import TaskService from "../task/TaskService";

export default class UserService {
  static getUsers = () => DatabaseService.prisma.user.findMany();

  static findUsers = (search: string) =>
    EmbeddingService.vectorSearch<UserType>(EntityType.user, search);

  static createUser = async (
    data: VovkBody<typeof UserController.createUser>,
  ) => {
    const user = await DatabaseService.prisma.user.create({
      data: {
        ...data,
        imageUrl: `https://i.pravatar.cc/300?u=${data.email}`,
      },
    });

    await EmbeddingService.generateEntityEmbedding(
      user.entityType,
      user.id as UserType["id"],
    );
    return user;
  };

  static updateUser = async (
    id: VovkParams<typeof UserController.updateUser>["id"],
    data: VovkBody<typeof UserController.updateUser>,
  ) => {
    const user = await DatabaseService.prisma.user.update({
      where: { id },
      data,
    });

    await EmbeddingService.generateEntityEmbedding(user.entityType, id);

    return user;
  };

  static deleteUser = async (
    id: VovkParams<typeof UserController.updateUser>["id"],
  ) => {
    // Even though we have `ON DELETE CASCADE`, we need to delete tasks explicitly to trigger DB events
    const tasksToDelete = await DatabaseService.prisma.task.findMany({
      where: { userId: id },
      select: { id: true },
    });

    // 1) Explicitly delete the user's tasks (fires DB events)
    // 2) Delete the user record
    // 3) Return a single payload that merges task deletion results with the user deletion result,
    //    preserving __isDeleted flags so the UI can reconcile in one update
    return Object.assign(
      {
        tasks: await Promise.all(
          tasksToDelete.map((t) =>
            TaskService.deleteTask(t.id as TaskType["id"]),
          ),
        ),
      },
      await DatabaseService.prisma.user.delete({
        where: { id },
        select: { id: true, entityType: true },
      }),
    );
  };
}
