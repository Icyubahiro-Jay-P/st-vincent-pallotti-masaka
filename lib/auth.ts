import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not set")
}

// This app has exactly one kind of account (school staff), so Better
// Auth's default "user" model is renamed to "admin". There is no public
// registration route: this app never mounts Better Auth's HTTP router
// (no /api/auth/[...all] route) since every call goes through server
// actions via auth.api.*, never a client-side SDK fetch, so one less public
// endpoint surface. disableSignUp is still set as defense in depth, so a
// future change that does add the HTTP router doesn't silently reopen
// public sign-up. The only way an admin account is ever created is
// scripts/seed-admin.ts, which inserts directly via Drizzle.
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  user: {
    modelName: "admin",
  },
  plugins: [nextCookies()],
})
