import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"

import { EventForm } from "@/components/admin/event-form"
import { db } from "@/lib/db"
import { events, eventMedia } from "@/lib/db/schema"

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const eventId = Number(id)
  const [event] = await db.select().from(events).where(eq(events.id, eventId))

  if (!event) {
    notFound()
  }

  const media = await db
    .select()
    .from(eventMedia)
    .where(eq(eventMedia.eventId, eventId))
    .orderBy(eventMedia.position)

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Edit event
      </h1>
      <EventForm
        defaultEvent={{
          id: event.id,
          titleEn: event.titleEn,
          titleFr: event.titleFr,
          excerptEn: event.excerptEn,
          excerptFr: event.excerptFr,
          bodyEn: event.bodyEn,
          bodyFr: event.bodyFr,
          category: event.category,
          coverImageUrl: event.coverImageUrl,
        }}
        existingMedia={media}
      />
    </div>
  )
}
