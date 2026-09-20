"use client"

import { updateInquiryStatus } from "@/app/admin/(dashboard)/admissions/actions"

const STATUSES = ["new", "contacted", "archived"] as const

export function InquiryStatusSelect({
  id,
  status,
}: {
  id: number
  status: string
}) {
  return (
    <form action={updateInquiryStatus}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="border border-border bg-background px-2 py-1 text-xs text-foreground"
      >
        {STATUSES.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </form>
  )
}
