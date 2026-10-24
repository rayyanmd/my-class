"use server";
import {
  assignment as assignmentTable,
  course as courseTable,
  typeEnum,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

type CreateAssignmentInput = {
  title: string;
  course: number;
  deadline: string;
  type: string;
  guide: string;
  submission: string;
};

type EditAssignmentInput = CreateAssignmentInput & {
  id: number;
};

function validateUrl(value: string, fieldName: string) {
  if (!value) return;

  try {
    new URL(value);
  } catch {
    throw new Error(`${fieldName} harus berupa url`);
  }
}

export async function createAssignment(input: CreateAssignmentInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role == "user") return;

  if (
    !input ||
    typeof input.title !== "string" ||
    typeof input.course !== "number" ||
    typeof input.deadline !== "string" ||
    typeof input.type !== "string" ||
    typeof input.guide !== "string" ||
    typeof input.submission !== "string"
  ) {
    throw new Error("Data tugas tidak valid");
  }

  const title = input.title.trim();
  const deadline = new Date(input.deadline);

  if (!title) throw new Error("Nama tugas wajib diisi");
  if (!Number.isInteger(input.course) || input.course <= 0) {
    throw new Error("Mata kuliah wajib dipilih");
  }
  if (Number.isNaN(deadline.getTime())) {
    throw new Error("Batas waktu tidak valid");
  }
  if (
    !typeEnum.enumValues.includes(
      input.type as (typeof typeEnum.enumValues)[number],
    )
  ) {
    throw new Error("Jenis tugas tidak valid");
  }

  const [course] = await db
    .select({ id: courseTable.id })
    .from(courseTable)
    .where(eq(courseTable.id, input.course))
    .limit(1);

  if (!course) throw new Error("Mata kuliah tidak ditemukan");

  validateUrl(input.guide, "Link panduan");
  validateUrl(input.submission, "Link pengumpulan");

  await db.insert(assignmentTable).values({
    title,
    courseId: input.course,
    deadline,
    type: input.type as (typeof typeEnum.enumValues)[number],
    guide: input.guide || null,
    submission: input.submission || null,
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function editAssignment(input: EditAssignmentInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role == "user") return;

  if (
    !input ||
    !Number.isInteger(input.id) ||
    input.id <= 0 ||
    typeof input.title !== "string" ||
    typeof input.course !== "number" ||
    typeof input.deadline !== "string" ||
    typeof input.type !== "string" ||
    typeof input.guide !== "string" ||
    typeof input.submission !== "string"
  ) {
    throw new Error("Data tugas tidak valid");
  }

  const title = input.title.trim();
  const deadline = new Date(input.deadline);

  if (!title) throw new Error("Nama tugas wajib diisi");
  if (!Number.isInteger(input.course) || input.course <= 0) {
    throw new Error("Mata kuliah wajib dipilih");
  }
  if (Number.isNaN(deadline.getTime())) {
    throw new Error("Batas waktu tidak valid");
  }
  if (
    !typeEnum.enumValues.includes(
      input.type as (typeof typeEnum.enumValues)[number],
    )
  ) {
    throw new Error("Jenis tugas tidak valid");
  }

  const [assignment] = await db
    .select({ id: assignmentTable.id })
    .from(assignmentTable)
    .where(eq(assignmentTable.id, input.id))
    .limit(1);

  if (!assignment) throw new Error("Tugas tidak ditemukan");

  const [course] = await db
    .select({ id: courseTable.id })
    .from(courseTable)
    .where(eq(courseTable.id, input.course))
    .limit(1);

  if (!course) throw new Error("Mata kuliah tidak ditemukan");

  validateUrl(input.guide, "Link panduan");
  validateUrl(input.submission, "Link pengumpulan");

  await db
    .update(assignmentTable)
    .set({
      title,
      courseId: input.course,
      deadline,
      type: input.type as (typeof typeEnum.enumValues)[number],
      guide: input.guide || null,
      submission: input.submission || null,
    })
    .where(eq(assignmentTable.id, input.id));

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteAssignment(id: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role == "user") return;

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Data tugas tidak valid");
  }

  const [assignment] = await db
    .select({ id: assignmentTable.id })
    .from(assignmentTable)
    .where(eq(assignmentTable.id, id))
    .limit(1);

  if (!assignment) throw new Error("Tugas tidak ditemukan");

  await db.delete(assignmentTable).where(eq(assignmentTable.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function markDone(assignmentId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return;

  await db
    .update(assignmentTable)
    .set({
      userDone: sql`
        CASE
          WHEN array_position(${assignmentTable.userDone}, ${session.user.id}) IS NOT NULL
            THEN array_remove(${assignmentTable.userDone}, ${session.user.id})
          ELSE array_append(${assignmentTable.userDone}, ${session.user.id})
        END
      `,
    })
    .where(eq(assignmentTable.id, assignmentId));
}
