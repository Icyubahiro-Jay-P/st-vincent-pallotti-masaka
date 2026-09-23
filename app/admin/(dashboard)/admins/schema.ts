import { z } from "zod"

import { emailSchema, nonEmptyString } from "@/lib/validation"

// Shared by createAdmin and CreateAdminForm (a "use server" file can only
// export async functions).
export const createAdminSchema = z.object({
  name: nonEmptyString(200, "a name"),
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(200),
})
