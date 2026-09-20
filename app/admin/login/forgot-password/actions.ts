"use server"

import { and, eq, gt, like } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { admin, verification } from "@/lib/db/schema"

export type ForgotPasswordState = {
  status: "idle" | "done"
  message?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const GENERIC_MESSAGE =
  "If that email exists, a reset link has been sent. Check your inbox."
// ponytail: fixed per-account cooldown against the existing `verification`
// table instead of a real rate-limit store. This app never mounts Better
// Auth's HTTP router (where its built-in limiter lives, see lib/auth.ts),
// so a direct auth.api.requestPasswordReset() call has no limiter in front
// of it otherwise. Fine for one admin account; swap for a real rate-limit
// store if this ever needs to handle more than one account's traffic.
const COOLDOWN_MS = 60_000

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim()

  // Always return the same response whether or not the email is valid, the
  // account exists, or a reset was actually sent — this form must not leak
  // account existence, and there's exactly one admin account to protect.
  if (email && EMAIL_PATTERN.test(email)) {
    const [account] = await db
      .select({ id: admin.id })
      .from(admin)
      .where(eq(admin.email, email))

    if (account) {
      const recent = await db
        .select({ id: verification.id })
        .from(verification)
        .where(
          and(
            eq(verification.value, account.id),
            like(verification.identifier, "reset-password:%"),
            gt(verification.createdAt, new Date(Date.now() - COOLDOWN_MS))
          )
        )

      if (recent.length === 0) {
        await auth.api.requestPasswordReset({
          body: { email, redirectTo: "/admin/reset-password" },
        })
      }
    }
  }

  return { status: "done", message: GENERIC_MESSAGE }
}
