import { desc } from "drizzle-orm"

import { db } from "@/lib/db"
import { admissionsInquiries } from "@/lib/db/schema"

export default async function AdminAdmissionsPage() {
  const inquiries = await db
    .select()
    .from(admissionsInquiries)
    .orderBy(desc(admissionsInquiries.createdAt))

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Admissions
        </h1>
      </div>

      <div className="overflow-hidden border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Parent</th>
              <th className="px-4 py-3 font-medium">Child</th>
              <th className="px-4 py-3 font-medium">Program</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Preferred term</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className="px-4 py-3 text-foreground">
                  {inquiry.parentName}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {inquiry.childName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {inquiry.program}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="flex flex-col">
                    <span>{inquiry.email}</span>
                    <span>{inquiry.phone}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {inquiry.preferredTerm ?? "-"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {inquiry.createdAt.toLocaleDateString()}
                </td>
                <td
                  className="max-w-xs truncate px-4 py-3 text-muted-foreground"
                  title={inquiry.message ?? undefined}
                >
                  {inquiry.message ?? "-"}
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No admissions inquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
