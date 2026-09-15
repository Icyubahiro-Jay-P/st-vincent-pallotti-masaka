import type { MetadataRoute } from "next"

const siteUrl = "https://www.pallottimasaka.org"

const routes = [
  "",
  "/about",
  "/academics",
  "/tvet",
  "/admissions",
  "/news",
  "/contact",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/admissions" ? 0.9 : 0.6,
  }))
}
