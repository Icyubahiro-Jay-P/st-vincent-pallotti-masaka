"use server"

import { redirect } from "next/navigation"
import { APIError } from "better-auth/api"

import { auth } from "@/lib/auth"
import { loginSchema } from "@/app/admin/login/schema"
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit"

export type LoginState = {
  status: "idle" | "error"
  message?: string
}

const TOO_MANY_ATTEMPTS = "Too many attempts. Please try again later."

export async function signInAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const rawEmail = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
  const ip = await getRequestIp()

  // Both keys must pass: IP-based catches distributed brute force, email-
  // based catches a single account being hammered from many IPs. Checked
  // before parsing so a malformed email still consumes the email budget.
  const [ipCheck, emailCheck] = await Promise.all([
    checkRateLimit(`login:ip:${ip}`, { max: 10, windowMs: 15 * 60 * 1000 }),
    rawEmail
      ? checkRateLimit(`login:email:${rawEmail}`, {
          max: 5,
          windowMs: 15 * 60 * 1000,
        })
      : Promise.resolve({ allowed: true }),
  ])

  if (!ipCheck.allowed || !emailCheck.allowed) {
    return { status: "error", message: TOO_MANY_ATTEMPTS }
  }

  const parsed = loginSchema.safeParse({
    email: rawEmail,
    password: String(formData.get("password") ?? ""),
  })

  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email and password." }
  }

  const { email, password } = parsed.data

  try {
    await auth.api.signInEmail({ body: { email, password } })
  } catch (error) {
    if (error instanceof APIError) {
      return { status: "error", message: "Incorrect email or password." }
    }
    throw error
  }

  redirect("/admin/events")
}
