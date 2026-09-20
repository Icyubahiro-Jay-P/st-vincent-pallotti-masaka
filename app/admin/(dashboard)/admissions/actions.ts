"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { admissionsInquiries } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"

const STATUSES = ["new", "contacted", "archived"] as const
export type InquiryStatus = (typeof STATUSES)[number]

export async function updateInquiryStatus(formData: FormData) {
  await requireAdmin()

  const id = Number(formData.get("id"))
  const status = String(formData.get("status") ?? "")
  if (!STATUSES.includes(status as InquiryStatus)) return

  await db
    .update(admissionsInquiries)
    .set({ status })
    .where(eq(admissionsInquiries.id, id))

  revalidatePath("/admin/admissions")
  redirect("/admin/admissions?toast=inquiry-status-updated")
}
