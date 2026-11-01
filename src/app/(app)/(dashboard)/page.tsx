import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { assignment, course, schedule } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDeadline } from "@/lib/utils";
import { asc, eq, gte } from "drizzle-orm";
import {
  ClockIcon,
  CheckIcon,
  PercentCircleIcon,
  CalendarIcon,
  BookAIcon,
} from "lucide-react";
import { headers } from "next/headers";
import { connection } from "next/server";

export default async function Dashboard() {
  await connection();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const today = new Date();
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Asia/Jakarta",
  }).format(today);
  const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    weekday,
  );
  const todayLabel = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeZone: "Asia/Jakarta",
  }).format(today);

  const assignments = await db
    .select({
      id: assignment.id,
      title: assignment.title,
      course: course.name,
      deadline: assignment.deadline,
      userDone: assignment.userDone,
    })
    .from(assignment)
    .where(gte(assignment.deadline, new Date()))
    .orderBy(assignment.deadline)
    .innerJoin(course, eq(assignment.courseId, course.id));

  const todaySchedule = await db
    .select({
      timeStart: schedule.timeStart,
      timeEnd: schedule.timeEnd,
      course: course.name,
      practicum: schedule.practicum,
      room: schedule.room,
    })
    .from(schedule)
    .innerJoin(course, eq(schedule.courseId, course.id))
    .where(eq(schedule.dayOfWeek, dayOfWeek))
    .orderBy(asc(schedule.timeStart));

  const userId = session?.user.id;
  const completedAssignments = assignments
    .filter((assignment) => userId && assignment.userDone.includes(userId))
    .map((assignment) => assignment.id);

  const sortedAssignments = [...assignments].sort(
    (a, b) =>
      Number(completedAssignments.includes(a.id)) -
      Number(completedAssignments.includes(b.id)),
  );

  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between items-center">
        <div className="w-full">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Selamat datang, {session?.user.name}!
          </p>
        </div>
      </div>
      <div className="lg:flex space-x-4 space-y-4">
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-start">
                <BookAIcon className="mr-2 shrink-0" />
                <span>Tugas</span>
              </CardTitle>
              <CardDescription>
                {assignments.length - completedAssignments.length == 0
                  ? "Yey udah selesai semua"
                  : `Deadline terdekat: ${formatDeadline(sortedAssignments[0].deadline)}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Card className="flex w-full flex-col justify-between">
                <CardHeader>
                  <CardTitle className="flex items-start">
                    <ClockIcon className="mr-2 shrink-0 text-red-500" />
                    <span>Belum Dikerjakan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-4xl font-bold">
                  {assignments.length - completedAssignments.length}
                </CardContent>
              </Card>

              <Card className="flex w-full flex-col justify-between">
                <CardHeader>
                  <CardTitle className="flex items-start">
                    <CheckIcon className="mr-2 shrink-0 text-green-500" />
                    <span>Sudah Dikerjakan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-4xl font-bold">
                  {completedAssignments.length}
                </CardContent>
              </Card>

              <Card className="flex w-full flex-col justify-between">
                <CardHeader>
                  <CardTitle className="flex items-start">
                    <PercentCircleIcon className="mr-2 shrink-0 text-blue-500" />
                    <span>Persentase</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-4xl font-bold">
                  {Math.round(
                    (completedAssignments.length / assignments.length) * 100,
                  ) + "%"}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
        <div className="w-full space-y-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-start">
                <CalendarIcon className="mr-2 shrink-0" />
                <span>Jadwal Hari Ini</span>
              </CardTitle>
              <CardDescription>{todayLabel}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Mata Kuliah</TableHead>
                    <TableHead>Ruangan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todaySchedule.length > 0 ? (
                    todaySchedule.map((item, index) => (
                      <TableRow
                        key={`${item.timeStart}-${item.course}-${index}`}
                      >
                        <TableCell>
                          {item.timeStart?.slice(0, 5)}-
                          {item.timeEnd?.slice(0, 5)}
                        </TableCell>
                        <TableCell>
                          {item.course} ({item.practicum ? "R" : "K"})
                        </TableCell>
                        <TableCell>{item.room}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                      >
                        selamat libur bos
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
