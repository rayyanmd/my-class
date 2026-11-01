"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

export async function createUser(input: {
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

  const response = await auth.api.createUser({
    body: {
      email: username + "@ss23.fun",
      name: input.name,
      password: input.password,
    },
    asResponse: true,
  });

  revalidatePath("/admin/user");

  return response.ok;
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
