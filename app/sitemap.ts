import type { MetadataRoute } from "next"

import { localePath, locales } from "@/lib/i18n/config"
import { siteConfig } from "@/lib/site-config"
import { cloudinaryUrl } from "@/lib/media/cloudinary-url"
import {
  getPublishedEventPhotoUrls,
  getPublishedEventSummaries,
} from "@/lib/events"
import { getPublishedPrograms } from "@/lib/programs"

// Both queries are now unstable_cache-backed (lib/events.ts,
// lib/programs.ts) with a 1h revalidate, so this no longer needs to hit
// the DB on every crawl  same cache tags an admin publish/delete
// invalidates via updateTag().
export const revalidate = 3600

// Evaluated once when the server instance boots, not per request  a
// defensible stand-in for "last modified" on routes with no real per-page
// content-update timestamp, without falling back to `new Date()`
// re-evaluated (and defeating caching) on every single request.
const BUILD_TIME = new Date()

const STATIC_ROUTES = [
  "",
  "/about",
  "/academics",
  "/tvet",
  "/admissions",
  "/news",
  "/gallery",
  "/contact",
]

// One entry per page per language (/en/about, /fr/about), each listing the
// other languages as hreflang alternates so search engines index them as
// translations of each other rather than duplicates.
function localized(route: string) {
  const languages = Object.fromEntries(
    locales.map((locale) => [
      locale,
      `${siteConfig.url}${localePath(locale, route || "/")}`,
    ])
  )
  return locales.map((locale) => ({
    url: languages[locale],
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publishedEvents, photoUrls, publishedPrograms] = await Promise.all([
    getPublishedEventSummaries(),
    getPublishedEventPhotoUrls(),
    // "tvet" gets its own dedicated /tvet route (already in STATIC_ROUTES)
    // rather than /academics/tvet  same filter academics/[slug]/page.tsx
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

  const staticEntries = routes.flatMap((route) =>
    localized(route).map((entry) => ({
      ...entry,
      lastModified: BUILD_TIME,
      changeFrequency:
        route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route === "/admissions" ? 0.9 : 0.6,
    }))
  )

  const eventEntries = publishedEvents.flatMap((event) =>
    localized(`/news/${event.slug}`).map((entry) => ({
      ...entry,
      lastModified: event.publishedAt
        ? new Date(event.publishedAt)
        : BUILD_TIME,
      changeFrequency: "monthly" as const,
      priority: 0.5,
      // f_auto via cloudinaryUrl so HEIC originals are served as JPEG/WebP,
      // formats Google Images actually indexes.
      images: [
        ...(event.coverImageUrl ? [event.coverImageUrl] : []),
        ...(photoUrls[event.slug] ?? []),
      ].map((url) => cloudinaryUrl(url, 1200)),
    }))
  )

  return [...staticEntries, ...eventEntries]
}
