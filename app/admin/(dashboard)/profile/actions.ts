"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { APIError } from "better-auth/api"

import { auth } from "@/lib/auth"
import { requireAdmin } from "@/lib/require-admin"
import { zodFieldErrors } from "@/lib/validation"
import {
  changeEmailSchema,
  passwordSchema,
  profileSchema,
} from "@/app/admin/(dashboard)/profile/schema"

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

export type ChangePasswordState = {
  status: "idle" | "error" | "success"
  message?: string
  fieldErrors?: Partial<
    Record<"currentPassword" | "newPassword" | "confirmPassword", string>
  >
}

export type ChangeEmailState = {
  status: "idle" | "error" | "success"
  message?: string
  fieldErrors?: Partial<Record<"email", string>>
}

export async function changeEmail(
  _prevState: ChangeEmailState,
  formData: FormData
): Promise<ChangeEmailState> {
  await requireAdmin()

  const parsed = changeEmailSchema.safeParse({
    email: String(formData.get("email") ?? ""),
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
    await auth.api.changeEmail({
      headers: await headers(),
      body: { newEmail: parsed.data.email },
    })
    if (parsed.data.revokeOtherSessions) {
      await auth.api.revokeOtherSessions({ headers: await headers() })
    }
  } catch (error) {
    if (error instanceof APIError) {
      return { status: "error", message: error.message }
    }
    throw error
  }

  revalidatePath("/admin/profile")
  return { status: "success", message: "Email updated." }
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
