import { z } from "zod"

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.")

export const urlSchema = z
  .string()
  .trim()
  .url("Enter a valid URL.")
  .refine(
    (value) => {
      try {
        return ["http:", "https:"].includes(new URL(value).protocol)
      } catch {
        return false
      }
    },
    { message: "URL must start with http:// or https://." }
  )

const PHONE_PATTERN = /^\+?[0-9\s\-()]{6,30}$/

export const phoneSchema = z
  .string()
  .trim()
  .min(6, "Enter a valid phone number.")
  .max(30, "Phone number is too long.")
  .regex(PHONE_PATTERN, "Enter a valid phone number.")

export function nonEmptyString(maxLen: number, label: string) {
  return z
    .string()
    .trim()
    .min(1, `Enter ${label}.`)
    .max(maxLen, `${label} must be ${maxLen} characters or fewer.`)
}

export function optionalString(maxLen: number, label: string) {
  return z
    .string()
    .trim()
    .max(maxLen, `${label} must be ${maxLen} characters or fewer.`)
    .optional()
}

export const positionSchema = z.coerce
  .number()
  .int("Position must be a whole number.")
  .nonnegative("Position must be zero or positive.")

// Maps a zod validation failure onto the flat { field: message } shape every
// form's fieldErrors already uses, keeping only the first issue per field.
export function zodFieldErrors<T extends Record<string, string>>(
  error: z.ZodError
): Partial<T> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0])
    if (!(key in out)) out[key] = issue.message
  }
  return out as Partial<T>
}
