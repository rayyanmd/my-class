"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const response = await auth.api.signInEmail({
    body: {
      email: username + "@ss23.fun",
      password,
    },
    asResponse: true,
  });

  return response.ok;
}
