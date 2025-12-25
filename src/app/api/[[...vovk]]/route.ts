import { initSegment } from "vovk";
import UserController from "../../../modules/user/UserController";
import TaskController from "../../../modules/task/TaskController";
import RealtimeController from "../../../modules/realtime/RealtimeController";
import DatabasePollController from "../../../modules/database/DatabasePollController";
import AiSdkController from "../../../modules/ai/AiSdkController";
import { get } from "vovk";

class StaticLike {
  @get("static/openapi.json")
  static async handle() {
    return { message: "This should not be available." };
  }
}

const controllers = {
  StaticLike: StaticLike,
  UserRPC: UserController,
  TaskRPC: TaskController,
  RealtimeRPC: RealtimeController,
  DatabasePollRPC: DatabasePollController,
  AiSdkRPC: AiSdkController,
};

export type Controllers = typeof controllers;

export const { GET, POST, PATCH, PUT, HEAD, OPTIONS, DELETE } = initSegment({
  emitSchema: true,
  controllers,
  onError: console.error,
});
