"use server"

import { redirect } from "next/navigation"
import { APIError } from "better-auth/api"

import { auth } from "@/lib/auth"

export type LoginState = {
  status: "idle" | "error"
  message?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function signInAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !EMAIL_PATTERN.test(email) || !password) {
    return { status: "error", message: "Enter a valid email and password." }
  }

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
