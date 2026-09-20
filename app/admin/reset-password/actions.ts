"use server"

import { redirect } from "next/navigation"
import { APIError } from "better-auth/api"

import { auth } from "@/lib/auth"

export type ResetPasswordState = {
  status: "idle" | "error"
  message?: string
}

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "")
  const newPassword = String(formData.get("newPassword") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (!token) {
    return {
      status: "error",
      message: "This reset link is invalid or has expired.",
    }
  }
  if (newPassword.length < 8) {
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
