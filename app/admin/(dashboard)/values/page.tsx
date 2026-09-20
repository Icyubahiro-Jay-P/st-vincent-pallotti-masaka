import Link from "next/link"
import { asc } from "drizzle-orm"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { values } from "@/lib/db/schema"
import { deleteValue } from "@/app/admin/(dashboard)/values/actions"

export default async function AdminValuesPage() {
  const allValues = await db.select().from(values).orderBy(asc(values.position))

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Values
        </h1>
        <Button
          render={<Link href="/admin/values/new" />}
          className="h-9 px-4 text-xs"
        >
          New value
        </Button>
      </div>

      <div className="overflow-hidden border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Position</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allValues.map((value) => (
              <tr key={value.id}>
                <td className="px-4 py-3 text-foreground">{value.titleEn}</td>
                <td className="px-4 py-3">
                  <Badge variant={value.isPublished ? "default" : "secondary"}>
                    {value.isPublished ? "published" : "draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {value.position}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      render={<Link href={`/admin/values/${value.id}/edit`} />}
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
                          <DialogTitle>Delete this value?</DialogTitle>
                          <DialogDescription>
                            &ldquo;{value.titleEn}&rdquo; will be permanently
                            removed. This can&apos;t be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose render={<Button variant="outline" />}>
                            Cancel
                          </DialogClose>
                          <form action={deleteValue}>
                            <input type="hidden" name="id" value={value.id} />
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
            {allValues.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No values yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
