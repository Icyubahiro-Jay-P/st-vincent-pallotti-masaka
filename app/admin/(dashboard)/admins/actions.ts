"use server"

import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq, count } from "drizzle-orm"
import { hashPassword } from "better-auth/crypto"
import { z } from "zod"

import { db } from "@/lib/db"
import { admin, account } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { emailSchema, nonEmptyString, zodFieldErrors } from "@/lib/validation"

const createAdminSchema = z.object({
  name: nonEmptyString(200, "a name"),
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(200),
})

export type CreateAdminState = {
  status: "idle" | "error" | "success"
  message?: string
  fieldErrors?: Partial<Record<"name" | "email" | "password", string>>
}

// Mirrors scripts/seed-admin.ts's insert pattern (admin row + linked
// account row with providerId "credential") rather than calling
// auth.api.signUpEmail, since emailAndPassword.disableSignUp is
// intentionally true in lib/auth.ts.
export async function createAdmin(
  _prevState: CreateAdminState,
  formData: FormData
): Promise<CreateAdminState> {
  await requireAdmin()

  const parsed = createAdminSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  })
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors: zodFieldErrors(parsed.error),
    }
  }

  const [existing] = await db
    .select({ id: admin.id })
    .from(admin)
    .where(eq(admin.email, parsed.data.email))
  if (existing) {
    return {
      status: "error",
      fieldErrors: { email: "An admin with this email already exists." },
    }
  }

  const id = randomUUID()
  await db.insert(admin).values({
    id,
    name: parsed.data.name,
    email: parsed.data.email,
    emailVerified: true,
  })
  await db.insert(account).values({
    id: randomUUID(),
    userId: id,
    providerId: "credential",
    accountId: id,
    password: await hashPassword(parsed.data.password),
  })

  revalidatePath("/admin/admins")
  return { status: "success", message: "Admin created." }
}

export async function deleteAdmin(formData: FormData) {
  const { user } = await requireAdmin()
  const id = String(formData.get("id") ?? "")

  if (id === user.id) {
    redirect("/admin/admins?toast=cannot-remove-self")
  }

  const [{ total }] = await db.select({ total: count() }).from(admin)
  if (total <= 1) {
    redirect("/admin/admins?toast=cannot-remove-last-admin")
  }

  // session/account rows cascade-delete via the onDelete: "cascade" FK
  // already on their userId columns in lib/db/schema.ts.
  await db.delete(admin).where(eq(admin.id, id))

  revalidatePath("/admin/admins")
  redirect("/admin/admins?toast=admin-removed")
}
