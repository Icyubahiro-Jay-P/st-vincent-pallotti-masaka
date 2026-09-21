import Link from "next/link"
import { asc, count } from "drizzle-orm"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PaginationNav } from "@/components/pagination-nav"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { db } from "@/lib/db"
import { milestones } from "@/lib/db/schema"
import { deleteMilestone } from "@/app/admin/(dashboard)/milestones/actions"
import { PAGE_SIZE, parsePage, totalPages } from "@/lib/pagination"

export default async function AdminMilestonesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const page = parsePage((await searchParams).page)
  const [allMilestones, [{ total }]] = await Promise.all([
    db
      .select()
      .from(milestones)
      .orderBy(asc(milestones.position))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(milestones),
  ])
  const pages = totalPages(total)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Milestones
        </h1>
        <Button
          render={<Link href="/admin/milestones/new" />}
          className="h-9 px-4 text-xs"
        >
          New milestone
        </Button>
      </div>

      <div className="overflow-hidden border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Position</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allMilestones.map((milestone) => (
              <tr key={milestone.id}>
                <td className="px-4 py-3 text-muted-foreground">
                  {milestone.yearEn}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {milestone.titleEn}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={milestone.isPublished ? "default" : "secondary"}
                  >
                    {milestone.isPublished ? "published" : "draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {milestone.position}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      render={
                        <Link href={`/admin/milestones/${milestone.id}/edit`} />
                      }
                      variant="outline"
                      size="xs"
                    >
                      Edit
                    </Button>
                    <Dialog>
                      <DialogTrigger
                        render={<Button variant="destructive" size="xs" />}
                      >
                        Delete
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete this milestone?</DialogTitle>
                          <DialogDescription>
                            &ldquo;{milestone.titleEn}&rdquo; will be
                            permanently removed. This can&apos;t be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose render={<Button variant="outline" />}>
                            Cancel
                          </DialogClose>
                          <form action={deleteMilestone}>
                            <input
                              type="hidden"
                              name="id"
                              value={milestone.id}
                            />
                            <Button type="submit" variant="destructive">
                              Delete
                            </Button>
                          </form>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </td>
              </tr>
            ))}
            {allMilestones.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No milestones yet.
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
          p <= 1 ? "/admin/milestones" : `/admin/milestones?page=${p}`
        }
      />
    </div>
  )
}
