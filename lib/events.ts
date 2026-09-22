import { cache } from "react"
import { unstable_cache } from "next/cache"
import { and, count, desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { events, eventMedia } from "@/lib/db/schema"
import { PAGE_SIZE } from "@/lib/pagination"

// Same unstable_cache(revalidate + tags) + cache() layering as
// lib/programs.ts — persists across requests/instances, invalidated on
// publish/delete via updateTag("events") in
// app/admin/(dashboard)/events/actions.ts, and deduped within one render.

const getLatestPublishedEventsCached = unstable_cache(
  async (limit: number) =>
    db
      .select()
      .from(events)
      .where(eq(events.status, "published"))
      .orderBy(desc(events.publishedAt))
      .limit(limit),
  ["latest-published-events"],
  { revalidate: 3600, tags: ["events"] }
)

export const getLatestPublishedEvents = cache(getLatestPublishedEventsCached)

const getPublishedEventsPageCached = unstable_cache(
  async (page: number) => {
    const [rows, [{ total }]] = await Promise.all([
      db
        .select({
          slug: events.slug,
          category: events.category,
          publishedAt: events.publishedAt,
          createdAt: events.createdAt,
          titleEn: events.titleEn,
          titleFr: events.titleFr,
          excerptEn: events.excerptEn,
          excerptFr: events.excerptFr,
        })
        .from(events)
        .where(eq(events.status, "published"))
        .orderBy(desc(events.publishedAt))
        .limit(PAGE_SIZE)
        .offset((page - 1) * PAGE_SIZE),
      db
        .select({ total: count() })
        .from(events)
        .where(eq(events.status, "published")),
    ])
    return { rows, total }
  },
  ["published-events-page"],
  { revalidate: 3600, tags: ["events"] }
)

export const getPublishedEventsPage = cache(getPublishedEventsPageCached)

const getPublishedEventBySlugCached = unstable_cache(
  async (slug: string) => {
    const [event] = await db
      .select()
      .from(events)
      .where(and(eq(events.slug, slug), eq(events.status, "published")))
      .limit(1)
    return event
  },
  ["published-event-by-slug"],
  { revalidate: 3600, tags: ["events"] }
)

export const getPublishedEventBySlug = cache(getPublishedEventBySlugCached)

const getEventMediaCached = unstable_cache(
  async (eventId: number) =>
    db
      .select()
      .from(eventMedia)
      .where(eq(eventMedia.eventId, eventId))
      .orderBy(eventMedia.position),
  ["event-media"],
  { revalidate: 3600, tags: ["events"] }
)

export const getEventMedia = cache(getEventMediaCached)

const getPublishedEventSummariesCached = unstable_cache(
  async () =>
    db
      .select({ slug: events.slug, publishedAt: events.publishedAt })
      .from(events)
      .where(eq(events.status, "published")),
  ["published-event-summaries"],
  { revalidate: 3600, tags: ["events"] }
)

export const getPublishedEventSummaries = cache(
  getPublishedEventSummariesCached
)
