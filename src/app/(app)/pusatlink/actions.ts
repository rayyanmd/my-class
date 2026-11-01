"use server";
import { link as linkTable, course as courseTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

type CreateAssignmentInput = {
  title: string;
  course: number;
  url: string;
};

function validateUrl(value: string, fieldName: string) {
  if (!value) return;

  try {
    new URL(value);
  } catch {
    throw new Error(`${fieldName} harus berupa url`);
  }
}

export async function createLink(input: CreateAssignmentInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role == "user") return;

  if (
    !input ||
    typeof input.title !== "string" ||
    typeof input.course !== "number" ||
    typeof input.url !== "string"
  ) {
    throw new Error("Data tugas tidak valid");
  }

  const title = input.title.trim();

  if (!title) throw new Error("Nama link wajib diisi");

  validateUrl(input.url, "Link");

  const values: {
    title: string;
    courseId?: number;
    url: string;
  } = {
    title,
    url: input.url,
  };

  if (Number.isInteger(input.course) && input.course > 0) {
    const [course] = await db
      .select({ id: courseTable.id })
      .from(courseTable)
      .where(eq(courseTable.id, input.course))
      .limit(1);

    if (!course) throw new Error("Mata kuliah tidak ditemukan");

    values.courseId = input.course;
  }

  await db.insert(linkTable).values(values);

  revalidatePath("/pusatlink");
}

export async function deleteLink(id: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role == "user") return;

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Data tugas tidak valid");
  }

  const [link] = await db
    .select({ id: linkTable.id })
    .from(linkTable)
    .where(eq(linkTable.id, id))
    .limit(1);

  if (!link) throw new Error("Tugas tidak ditemukan");

  await db.delete(linkTable).where(eq(linkTable.id, id));

  revalidatePath("/pusatlink");
}
