import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

import { db } from "./db"; // your drizzle instance
import * as schema from "@/db/schema";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 1,
    disableSignUp: true,
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "user" },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  plugins: [admin(), nextCookies()],
});
