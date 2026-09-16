import type { MetadataRoute } from "next"

import { locales } from "@/lib/i18n/config"

const siteUrl = "https://www.pallottimasaka.org"

const programSlugs = [
  "day-care",
  "kindergarten",
  "special-needs",
  "cambridge-primary",
  "national-primary",
  "national-secondary",
]

const routes = [
  "",
  "/about",
  "/academics",
  ...programSlugs.map((slug) => `/academics/${slug}`),
  "/tvet",
  "/admissions",
  "/news",
  "/contact",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: route === "" ? 1 : route === "/admissions" ? 0.9 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteUrl}/${l}${route}`])
        ),
      },
    }))
  )
}
