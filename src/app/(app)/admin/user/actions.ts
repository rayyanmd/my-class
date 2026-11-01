"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const userInputSchema = z.object({
  username: z.string().regex(/^[A-Za-z]\d{10}$/),
  name: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(["user", "pj", "admin"]).default("user"),
});

export async function createUser(input: {
  username: string;
  name: string;
  password: string;
  role?: "user" | "pj" | "admin";
}) {
  const inputResult = userInputSchema.safeParse(input);
  if (!inputResult.success) {
    return false;
  }

  const { username, name, password, role } = inputResult.data;

  const response = await auth.api.createUser({
    body: {
      email: username + "@ss23.fun",
      name,
      password,
    },
    asResponse: true,
  });

  if (response.ok && role !== "user") {
    const created = (await response.clone().json()) as {
      user?: { id?: string };
    };
    if (created.user?.id) {
      await db.update(user).set({ role }).where(eq(user.id, created.user.id));
    }
  }

  revalidatePath("/admin/user");

  return response.ok;
}

const importRowSchema = userInputSchema.extend({
  row: z.number().int().positive(),
});

export async function importUsers(
  rows: {
    row: number;
    username: string;
    name: string;
    password: string;
    role: string;
  }[],
) {
  const results: { row: number; error: string }[] = [];

  for (const row of rows) {
    const parsed = importRowSchema.safeParse({
      ...row,
      username: row.username.trim(),
      name: row.name.trim(),
      password: row.password.trim(),
      role: row.role.trim().toLowerCase(),
    });

    if (!parsed.success) {
      results.push({
        row: row.row,
        error: "NIM, nama, password, atau role tidak valid",
      });
      continue;
    }

    const response = await auth.api.createUser({
      body: {
        email: parsed.data.username + "@ss23.fun",
        name: parsed.data.name,
        password: parsed.data.password,
      },
      asResponse: true,
    });

    if (!response.ok) {
      results.push({
        row: row.row,
        error: "User mungkin sudah ada atau gagal dibuat",
      });
    } else if (parsed.data.role !== "user") {
      const created = (await response.clone().json()) as {
        user?: { id?: string };
      };
      if (!created.user?.id) {
        results.push({
          row: parsed.data.row,
          error: "User dibuat tetapi role gagal disimpan",
        });
      } else {
        await db
          .update(user)
          .set({ role: parsed.data.role })
          .where(eq(user.id, created.user.id));
      }
    }
  }

  revalidatePath("/admin/user");
  return results;
}

export async function editUser(input: {
  id: string;
  username: string;
  name: string;
  password: string;
}) {
  const usernameResult = z
    .string()
    .regex(/^[A-Za-z]\d{10}$/)
    .safeParse(input.username);

  if (!usernameResult.success) {
    return false;
  }

  const username = usernameResult.data;

  const data: { email: string; name: string; password?: string } = {
    email: username + "@ss23.fun",
    name: input.name,
  };

  if (input.password) {
    data.password = input.password;
  }

  const response = await auth.api.adminUpdateUser({
    body: {
      userId: input.id,
      data,
    },
    headers: await headers(),
    asResponse: true,
  });

  return response.ok;
}

export async function deleteUser(id: string) {
  const response = await auth.api.removeUser({
    body: {
      userId: id,
    },
    headers: await headers(),
    asResponse: true,
  });

  return response.ok;
}
