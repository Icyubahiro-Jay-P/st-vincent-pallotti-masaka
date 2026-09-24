import { cache } from "react"
import { unstable_cache } from "next/cache"
import { and, count, desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { events, eventMedia } from "@/lib/db/schema"
import { PAGE_SIZE } from "@/lib/pagination"

// Same unstable_cache(revalidate + tags) + cache() layering as
// lib/programs.ts / lib/site-settings.ts  persists across
// requests/instances, invalidated on publish/delete via
// updateTag("events") in app/admin/(dashboard)/events/actions.ts, and
// deduped within one render.
//
// unstable_cache JSON-serializes its return value, which silently turns
// Date into a string  convert explicitly here (same fix as
// lib/site-settings.ts) so callers get an honest string type instead of
// assuming publishedAt/createdAt are still Date instances.

function toDateString(value: Date | null): string | null {
  return value ? value.toISOString() : null
}

const getLatestPublishedEventsCached = unstable_cache(
  async (limit: number) => {
    const rows = await db
      .select()
      .from(events)
      .where(eq(events.status, "published"))
      .orderBy(desc(events.publishedAt))
      .limit(limit)

    return rows.map((row) => ({
      ...row,
      publishedAt: toDateString(row.publishedAt),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }))
  },
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

    return {
      rows: rows.map((row) => ({
        ...row,
        publishedAt: toDateString(row.publishedAt),
        createdAt: row.createdAt.toISOString(),
      })),
      total,
    }
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

    if (!event) return undefined

    return {
      ...event,
      publishedAt: toDateString(event.publishedAt),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }
  },
  ["published-event-by-slug"],
  { revalidate: 3600, tags: ["events"] }
)

export const getPublishedEventBySlug = cache(getPublishedEventBySlugCached)

// eventMedia's createdAt isn't read by any caller today, so it's left
// as-is (JSON round-trip still silently turns it into a string, same
// caveat as above  just not one anything currently relies on).
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
  async () => {
    const rows = await db
      .select({
        slug: events.slug,
        publishedAt: events.publishedAt,
        coverImageUrl: events.coverImageUrl,
      })
      .from(events)
      .where(eq(events.status, "published"))

    return rows.map((row) => ({
      ...row,
      publishedAt: toDateString(row.publishedAt),
    }))
  },
  ["published-event-summaries"],
  { revalidate: 3600, tags: ["events"] }
)

export const getPublishedEventSummaries = cache(
  getPublishedEventSummariesCached
)

const publishedPhoto = and(
  eq(events.status, "published"),
  eq(eventMedia.kind, "photo")
)

// Photo urls per published event slug, for the image sitemap. One query,
// grouped here rather than one getEventMedia call per event.
const getPublishedEventPhotoUrlsCached = unstable_cache(
  async () => {
    const rows = await db
      .select({ slug: events.slug, url: eventMedia.cloudinaryUrl })
      .from(eventMedia)
      .innerJoin(events, eq(eventMedia.eventId, events.id))
      .where(publishedPhoto)
      .orderBy(eventMedia.position)

    const bySlug: Record<string, string[]> = {}
    for (const row of rows) (bySlug[row.slug] ??= []).push(row.url)
    return bySlug
  },
  ["published-event-photo-urls"],
  { revalidate: 3600, tags: ["events"] }
)

export const getPublishedEventPhotoUrls = cache(
  getPublishedEventPhotoUrlsCached
)

const getPublishedPhotosPageCached = unstable_cache(
  async (page: number) => {
    const [rows, [{ total }]] = await Promise.all([
      db
        .select({
          id: eventMedia.id,
          url: eventMedia.cloudinaryUrl,
          slug: events.slug,
          titleEn: events.titleEn,
          titleFr: events.titleFr,
        })
        .from(eventMedia)
        .innerJoin(events, eq(eventMedia.eventId, events.id))
        .where(publishedPhoto)
        .orderBy(desc(events.publishedAt), eventMedia.position)
        .limit(PAGE_SIZE)
        .offset((page - 1) * PAGE_SIZE),
      db
        .select({ total: count() })
        .from(eventMedia)
        .innerJoin(events, eq(eventMedia.eventId, events.id))
        .where(publishedPhoto),
    ])

    return { rows, total }
  },
  ["published-photos-page"],
  { revalidate: 3600, tags: ["events"] }
)

export const getPublishedPhotosPage = cache(getPublishedPhotosPageCached)
