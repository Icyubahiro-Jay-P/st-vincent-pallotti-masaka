import type { MetadataRoute } from "next"

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

// Each page now has exactly one URL (language is a cookie, not a URL
// segment), so there's only one entry per route rather than one per locale.
// Search engines never send cookies on first crawl, so they'll only ever
// index the default-language version of each page; that's the trade-off of
// not using locale-prefixed URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/admissions" ? 0.9 : 0.6,
  }))
}
