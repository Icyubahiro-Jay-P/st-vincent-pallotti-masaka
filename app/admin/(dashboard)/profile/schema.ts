import { z } from "zod"

import { nonEmptyString } from "@/lib/validation"

// Shared by the server actions and the client forms (a "use server" file
// can only export async functions).

// Server passes a boolean, the client's FormData passes "on" or nothing.
const checkbox = z.preprocess(
  (value) => value === true || value === "on",
  z.boolean()
)

export const profileSchema = z.object({
  name: nonEmptyString(200, "your name"),
})

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(200),
    confirmPassword: z.string(),
    revokeOtherSessions: checkbox,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })

export const changeEmailSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  revokeOtherSessions: checkbox,
})
