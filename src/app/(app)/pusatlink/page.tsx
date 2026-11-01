import { db } from "@/lib/db";
import { course, link } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CreateLink } from "./components/create-link";
import PusatLinkList from "./components/pusatlink-list";

export default async function PusatLink() {
  await connection();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const courses = await db.select().from(course);

  const links = await db
    .select({
      id: link.id,
      title: link.title,
      course: course.name,
      url: link.url,
    })
    .from(link)
    .orderBy(desc(link.updatedAt))
    .leftJoin(course, eq(link.courseId, course.id));

  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between items-center">
        <div className="w-full">
          <h1 className="text-2xl font-bold">Pusat Link</h1>
          <p className="text-sm text-muted-foreground">
            Link-link penting ada di sini
          </p>
        </div>
        {session?.user.role != "user" && <CreateLink courses={courses} />}
      </div>
      <PusatLinkList links={links} pj={session?.user.role != "user"} />
    </div>
  );
}
