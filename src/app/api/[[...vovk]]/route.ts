import { initSegment } from 'vovk';
import AiSdkController from '../../../modules/ai/AiSdkController';
import DatabasePollController from '../../../modules/database/DatabasePollController';
import RealtimeController from '../../../modules/realtime/RealtimeController';
import TaskController from '../../../modules/task/TaskController';
import UserController from '../../../modules/user/UserController';

const controllers = {
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
