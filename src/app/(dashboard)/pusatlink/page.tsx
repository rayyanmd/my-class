import AssignmentList from "./components/pusatlink-list";
import { db } from "@/lib/db";
import { assignment, course } from "@/db/schema";
import { eq, gte } from "drizzle-orm";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CreateAssignment } from "./components/create-assignment";

export default async function PusatLink() {
  await connection();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const courses = await db.select().from(course);

  const assignments = await db
    .select({
      id: assignment.id,
      title: assignment.title,
      course: course.name,
      deadline: assignment.deadline,
      type: assignment.type,
      guide: assignment.guide,
      submission: assignment.submission,
      userDone: assignment.userDone,
    })
    .from(assignment)
    .where(gte(assignment.deadline, new Date()))
    .orderBy(assignment.deadline)
    .innerJoin(course, eq(assignment.courseId, course.id));

  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between items-center">
        <div className="w-full">
          <h1 className="text-2xl font-bold">Pusat Link SS23</h1>
          <p className="text-sm text-muted-foreground">
            Link-link penting ada di sini
          </p>
        </div>
        {session?.user.role != "user" && <CreateAssignment courses={courses} />}
      </div>
      {/* <AssignmentList
        assignments={assignments}
        userId={session?.user.id!}
        pj={session?.user.role != "user"}
        courses={courses}
      /> */}
    </div>
  );
}
