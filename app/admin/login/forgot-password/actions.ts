"use server"

import { eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { admin } from "@/lib/db/schema"
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit"
import { emailSchema } from "@/lib/validation"

export type ForgotPasswordState = {
  status: "idle" | "done"
  message?: string
}

const GENERIC_MESSAGE =
  "If that email exists, a reset link has been sent. Check your inbox."

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()

  // Always return the same response whether or not the email is valid, the
  // account exists, a reset was actually sent, or the rate limit was hit
  // this form must not leak account existence, and there's exactly one
  // admin account to protect.
  const ip = await getRequestIp()
  const { allowed: ipAllowed } = await checkRateLimit(
    `forgot-password:ip:${ip}`,
    { max: 10, windowMs: 60 * 60 * 1000 }
  )

  if (
    ipAllowed &&
    email.length <= 320 &&
    emailSchema.safeParse(email).success
  ) {
    const [account] = await db
      .select({ id: admin.id })
      .from(admin)
      .where(eq(admin.email, email))

    if (account) {
      const { allowed } = await checkRateLimit(
        `forgot-password:email:${email}`,
        { max: 3, windowMs: 60 * 60 * 1000 }
      )

      if (allowed) {
        await auth.api.requestPasswordReset({
          body: { email, redirectTo: "/admin/reset-password" },
        })
      }
    }
  }

  return { status: "done", message: GENERIC_MESSAGE }
}
