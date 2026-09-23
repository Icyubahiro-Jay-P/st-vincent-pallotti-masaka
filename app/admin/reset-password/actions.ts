"use server"

import { redirect } from "next/navigation"
import { APIError } from "better-auth/api"

import { auth } from "@/lib/auth"
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit"
import { resetPasswordSchema } from "@/app/admin/reset-password/schema"

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

  const parsed = resetPasswordSchema.safeParse({
    token: String(formData.get("token") ?? ""),
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  })
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message }
  }
  const { newPassword, token } = parsed.data

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
