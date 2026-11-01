import { db } from "@/lib/db";
import UserList from "./components/user-list";
import CreateUser from "./components/create-user";
import ImportUsers from "./components/import-users";

export default async function User() {
  const users = await db.query.user.findMany({
    with: {
      sessions: {
        orderBy: (session, { desc }) => [desc(session.createdAt)],
        limit: 1,
      },
    },
  });
  const usersWithLastSession = users.map(({ sessions, ...currentUser }) => ({
    ...currentUser,
    lastSession: sessions[0],
  }));

  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between items-center">
        <div className="w-full">
          <h1 className="text-2xl font-bold">List User</h1>
          <p className="text-sm text-muted-foreground">
            List orang-orangan SS23
          </p>
        </div>
        <div className="flex gap-2">
          <ImportUsers />
          <CreateUser />
        </div>
      </div>

      <UserList users={usersWithLastSession} />
    </div>
  );
}
