import { count, desc } from "drizzle-orm"

import { db } from "@/lib/db"
import { admissionsInquiries } from "@/lib/db/schema"
import { InquiryStatusSelect } from "@/components/admin/inquiry-status-select"
import { PaginationNav } from "@/components/pagination-nav"
import { PAGE_SIZE, parsePage, totalPages } from "@/lib/pagination"
import { getPublishedPrograms } from "@/lib/programs"
import { admissionsTermLabel } from "@/lib/admissions-terms"

export default async function AdminAdmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const page = parsePage((await searchParams).page)
  const [inquiries, [{ total }], programs] = await Promise.all([
    db
      .select()
      .from(admissionsInquiries)
      .orderBy(desc(admissionsInquiries.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(admissionsInquiries),
    // Inquiries store a canonical program slug; resolve to a display name
    // here rather than in the DB row. Falls back to the raw slug if a
    // program was later renamed or unpublished.
    getPublishedPrograms("en"),
  ])
  const pages = totalPages(total)
  const programNameBySlug = new Map(
    programs.map((program) => [program.slug, program.name])
  )

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
              <th className="px-4 py-3 font-medium">Status</th>
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
                <td className="px-4 py-3">
                  <InquiryStatusSelect
                    id={inquiry.id}
                    status={inquiry.status}
                  />
                </td>
                <td className="px-4 py-3 text-foreground">
                  {inquiry.parentName}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {inquiry.childName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {programNameBySlug.get(inquiry.program) ?? inquiry.program}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="flex flex-col">
                    <span>{inquiry.email}</span>
                    <span>{inquiry.phone}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {inquiry.preferredTerm
                    ? admissionsTermLabel(inquiry.preferredTerm, inquiry.locale)
                    : "-"}
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
                  colSpan={8}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No admissions inquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaginationNav
        page={page}
        totalPages={pages}
        buildHref={(p) =>
          p <= 1 ? "/admin/admissions" : `/admin/admissions?page=${p}`
        }
      />
    </div>
  )
}
