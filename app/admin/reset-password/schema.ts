import { z } from "zod"

// Shared by resetPassword and ResetPasswordForm (a "use server" file can
// only export async functions).
export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .min(1, "This reset link is invalid or has expired.")
      .max(500, "This reset link is invalid or has expired."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(200, "Password must be 200 characters or fewer."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })
