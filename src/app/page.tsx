import type { TaskType } from '@schemas/models/Task.schema';
import type { UserType } from '@schemas/models/User.schema';
import AppHeader from '@/components/AppHeader';
import { ExpandableChatDemo } from '@/components/ExpandableChatDemo';
import HydrateRegistry from '@/components/HydrateRegistry';
import UserKanban from '@/components/UserKanban';
import UserList from '@/components/UserList';
import { verifySession } from '@/lib/dal';
import TaskController from '@/modules/task/TaskController';
import UserController from '@/modules/user/UserController';

export const runtime = 'nodejs';

export const revalidate = 0;

export default async function Home() {
  await verifySession();
  const [usersInitialData, tasksInitialData] = await Promise.all([
    UserController.getUsers.fn<UserType[]>(),
    TaskController.getTasks.fn<TaskType[]>(),
  ]);

  return (
    <>
      <AppHeader />
      <HydrateRegistry users={usersInitialData} tasks={tasksInitialData} />
      <UserList initialData={usersInitialData} />
      <UserKanban initialData={tasksInitialData} />
      <ExpandableChatDemo />
    </>
  );
}
