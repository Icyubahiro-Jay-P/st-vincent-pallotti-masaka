import { z } from "zod"

// Shared by signInAdmin and AdminLoginForm (a "use server" file can only
// export async functions).
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(320).email(),
  // Login password: any non-empty string must reach auth.api.signInEmail so
  // the auth layer itself rejects it  this isn't a new-password rule.
  password: z.string().min(1),
})
