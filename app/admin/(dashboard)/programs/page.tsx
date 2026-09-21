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
import { programs } from "@/lib/db/schema"
import { deleteProgram } from "@/app/admin/(dashboard)/programs/actions"
import { PAGE_SIZE, parsePage, totalPages } from "@/lib/pagination"

export default async function AdminProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const page = parsePage((await searchParams).page)
  const [allPrograms, [{ total }]] = await Promise.all([
    db
      .select()
      .from(programs)
      .orderBy(asc(programs.position))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(programs),
  ])
  const pages = totalPages(total)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Programs
        </h1>
        <Button
          render={<Link href="/admin/programs/new" />}
          className="h-9 px-4 text-xs"
        >
          New program
        </Button>
      </div>

      <div className="overflow-hidden border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Position</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allPrograms.map((program) => (
              <tr key={program.id}>
                <td className="px-4 py-3 text-foreground">{program.nameEn}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={program.isPublished ? "default" : "secondary"}
                  >
                    {program.isPublished ? "published" : "draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {program.position}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      render={
                        <Link href={`/admin/programs/${program.id}/edit`} />
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
                          <DialogTitle>Delete this program?</DialogTitle>
                          <DialogDescription>
                            &ldquo;{program.nameEn}&rdquo; will be permanently
                            removed. This can&apos;t be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose render={<Button variant="outline" />}>
                            Cancel
                          </DialogClose>
                          <form action={deleteProgram}>
                            <input type="hidden" name="id" value={program.id} />
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
            {allPrograms.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No programs yet.
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
          p <= 1 ? "/admin/programs" : `/admin/programs?page=${p}`
        }
      />
    </div>
  )
}
