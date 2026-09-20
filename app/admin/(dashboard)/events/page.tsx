import Link from "next/link"
import { desc } from "drizzle-orm"

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
import { events } from "@/lib/db/schema"
import { deleteEvent } from "@/app/admin/(dashboard)/events/actions"

export default async function AdminEventsPage() {
  const allEvents = await db
    .select()
    .from(events)
    .orderBy(desc(events.createdAt))

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Events
        </h1>
        <Button
          render={<Link href="/admin/events/new" />}
          className="h-9 px-4 text-xs"
        >
          New event
        </Button>
      </div>

      <div className="overflow-hidden border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allEvents.map((event) => (
              <tr key={event.id}>
                <td className="px-4 py-3 text-foreground">{event.titleEn}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        event.status === "published" ? "default" : "secondary"
                      }
                    >
                      {event.status}
                    </Badge>
                    {event.needsTranslationReview && (
                      <Badge variant="destructive">Review translation</Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {event.category}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      render={<Link href={`/admin/events/${event.id}/edit`} />}
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
                          <DialogTitle>Delete this event?</DialogTitle>
                          <DialogDescription>
                            &ldquo;{event.titleEn}&rdquo; will be permanently
                            removed. This can&apos;t be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose render={<Button variant="outline" />}>
                            Cancel
                          </DialogClose>
                          <form action={deleteEvent}>
                            <input type="hidden" name="id" value={event.id} />
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
            {allEvents.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
