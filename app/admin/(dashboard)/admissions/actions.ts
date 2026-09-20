"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { admissionsInquiries } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"

const STATUSES = ["new", "contacted", "archived"] as const
export type InquiryStatus = (typeof STATUSES)[number]
const statusSchema = z.enum(STATUSES)

export async function updateInquiryStatus(formData: FormData) {
  await requireAdmin()

  const id = Number(formData.get("id"))
  const parsedStatus = statusSchema.safeParse(formData.get("status"))
  if (!parsedStatus.success) return
  const status = parsedStatus.data

  await db
    .update(admissionsInquiries)
    .set({ status })
    .where(eq(admissionsInquiries.id, id))

  revalidatePath("/admin/admissions")
  redirect("/admin/admissions?toast=inquiry-status-updated")
}
