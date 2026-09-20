"use server"

import { redirect } from "next/navigation"
import { APIError } from "better-auth/api"

import { auth } from "@/lib/auth"
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit"

export type ResetPasswordState = {
  status: "idle" | "error"
  message?: string
}

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const ip = await getRequestIp()
  const { allowed } = await checkRateLimit(`reset-password:${ip}`, {
    max: 10,
    windowMs: 60 * 60 * 1000,
  })
  if (!allowed) {
    return {
      status: "error",
      message: "Too many attempts. Please try again later.",
    }
  }

  const token = String(formData.get("token") ?? "")
  const newPassword = String(formData.get("newPassword") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (!token || token.length > 500) {
    return {
      status: "error",
      message: "This reset link is invalid or has expired.",
    }
  }
  if (newPassword.length < 8 || newPassword.length > 200) {
    return {
      status: "error",
      message: "Password must be at least 8 characters.",
    }
  }
  if (newPassword !== confirmPassword) {
    return { status: "error", message: "Passwords don't match." }
  }

  try {
    await auth.api.resetPassword({ body: { newPassword, token } })
  } catch (error) {
    if (error instanceof APIError) {
      return { status: "error", message: error.message }
    }
    throw error
  }

  redirect("/admin/login?reset=success")
}
