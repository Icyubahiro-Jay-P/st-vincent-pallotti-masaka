import type { MetadataRoute } from "next"
import { eq } from "drizzle-orm"

import { siteConfig } from "@/lib/site-config"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
import { getPublishedPrograms } from "@/lib/programs"

// Queries the DB, so this must not be statically prerendered at build
// time (a build shouldn't fail just because the DB is briefly unreachable
// during a deploy). Defer the query to request time instead.
export const dynamic = "force-dynamic"

// Evaluated once when the server instance boots, not per request — a
// defensible stand-in for "last modified" on routes with no real per-page
// content-update timestamp, without falling back to `new Date()`
// re-evaluated (and defeating caching) on every single request.
const BUILD_TIME = new Date()

const STATIC_ROUTES = ["", "/about", "/academics", "/tvet", "/admissions", "/news", "/contact"]

// Each page now has exactly one URL (language is a cookie, not a URL
// segment), so there's only one entry per route rather than one per locale.
// Search engines never send cookies on first crawl, so they'll only ever
// index the default-language version of each page; that's the trade-off of
// not using locale-prefixed URLs.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publishedEvents, publishedPrograms] = await Promise.all([
    db
      .select({ slug: events.slug, publishedAt: events.publishedAt })
      .from(events)
      .where(eq(events.status, "published")),
    // "tvet" gets its own dedicated /tvet route (already in STATIC_ROUTES)
    // rather than /academics/tvet — same filter academics/[slug]/page.tsx
    // applies, so an unpublished/renamed program can't leave a dangling
    // sitemap link.
    getPublishedPrograms("en").then((programs) =>
      programs.filter((program) => program.slug !== "tvet")
    ),
  ])

  const routes = [
    ...STATIC_ROUTES,
    ...publishedPrograms.map((program) => `/academics/${program.slug}`),
  ]

  const staticEntries = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: BUILD_TIME,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : route === "/admissions" ? 0.9 : 0.6,
  }))

  const eventEntries = publishedEvents.map((event) => ({
    url: `${siteConfig.url}/news/${event.slug}`,
    lastModified: event.publishedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  return [...staticEntries, ...eventEntries]
}
