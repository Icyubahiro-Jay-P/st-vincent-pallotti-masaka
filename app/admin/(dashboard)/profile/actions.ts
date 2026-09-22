"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { APIError } from "better-auth/api"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { requireAdmin } from "@/lib/require-admin"
import { nonEmptyString, zodFieldErrors } from "@/lib/validation"

const profileSchema = z.object({
  name: nonEmptyString(200, "your name"),
})

export type UpdateProfileState = {
  status: "idle" | "error" | "success"
  message?: string
  fieldErrors?: Partial<Record<"name", string>>
}

export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  await requireAdmin()

  const parsed = profileSchema.safeParse({
    name: String(formData.get("name") ?? ""),
  })
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors: zodFieldErrors(parsed.error),
    }
  }

  await auth.api.updateUser({
    headers: await headers(),
    body: { name: parsed.data.name },
  })

  revalidatePath("/admin/profile")
  return { status: "success", message: "Profile updated." }
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(200),
    confirmPassword: z.string(),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })

export type ChangePasswordState = {
  status: "idle" | "error" | "success"
  message?: string
  fieldErrors?: Partial<
    Record<"currentPassword" | "newPassword" | "confirmPassword", string>
  >
}

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  await requireAdmin()

  const parsed = passwordSchema.safeParse({
    currentPassword: String(formData.get("currentPassword") ?? ""),
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    revokeOtherSessions: formData.get("revokeOtherSessions") === "on",
  })
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors: zodFieldErrors(parsed.error),
    }
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: parsed.data.revokeOtherSessions,
      },
    })
  } catch (error) {
    if (error instanceof APIError) {
      return { status: "error", message: error.message }
    }
    throw error
  }

  return { status: "success", message: "Password changed." }
}
