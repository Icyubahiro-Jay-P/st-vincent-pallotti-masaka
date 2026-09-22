import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { Resend } from "resend"

import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"

// Skipped during `next build`'s page-data collection (NEXT_PHASE is set to
// this by Next itself) - that step imports every route's modules just to
// analyze them, before the real production env is necessarily what it'll
// be at runtime, so throwing here would fail the build even with a
// correctly configured deploy. Only enforced when this module actually
// loads in a running server.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build"

if (!isBuildPhase && !process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not set")
}

if (
  !isBuildPhase &&
  process.env.NODE_ENV === "production" &&
  !process.env.BETTER_AUTH_URL?.startsWith("https://")
) {
  throw new Error("BETTER_AUTH_URL must be an https:// URL in production")
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Reuses the same Resend project/env vars as
// lib/newsletter/send-event-newsletter.ts. This app never mounts Better
// Auth's HTTP router (see the comment below), so this only ever runs via a
// direct auth.api.requestPasswordReset(...) call from a server action.
async function sendResetPassword({
  user,
  url,
}: {
  user: { email: string }
  url: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const fromAddress = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !fromAddress) {
    console.error(
      "[auth] RESEND_API_KEY or RESEND_FROM_EMAIL not set, skipping reset email"
    )
    return
  }

  const resend = new Resend(apiKey)
  await resend.emails.send({
    from: fromAddress,
    to: user.email,
    subject: "Reset your Pallotti Admin password",
    html: `
      <p>A password reset was requested for this admin account.</p>
      <p><a href="${escapeHtml(url)}">Reset your password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  })
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
    sendResetPassword,
  },
  user: {
    modelName: "admin",
    // No HTTP router is mounted (see comment above), so the
    // verification-email paths for changeEmail aren't reachable. Admins
    // are seeded with emailVerified: false, so the immediate-update path
    // applies instead - see scripts/seed-admin.ts.
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
    },
  },
  plugins: [nextCookies()],
})
