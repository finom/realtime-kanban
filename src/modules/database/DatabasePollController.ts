import { EntityType } from "@prisma/client";
import { procedure, get, JSONLinesResponse, prefix, type VovkIteration } from "vovk";
import { z } from "zod";
import { TaskSchema, UserSchema } from "@schemas/index";
import DatabasePollService from "./DatabasePollService";
import { sessionGuard } from "@/decorators/sessionGuard";

@prefix("poll")
export default class DatabasePollController {
  @get()
  @sessionGuard()
  static poll = procedure({
    preferTransformed: false,
    iteration: z.union([
      z.object({
        id: z.uuid(),
        entityType: z.enum(EntityType),
        __isDeleted: z.boolean().optional(),
      }),
      UserSchema,
      TaskSchema,
    ]),
    async handle(req) {
      const response = new JSONLinesResponse<
        VovkIteration<typeof DatabasePollController.poll>
      >(req);

      void DatabasePollService.poll(response);

      return response;
    },
  });
}
