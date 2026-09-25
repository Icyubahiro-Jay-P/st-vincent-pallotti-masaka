import { siteConfig } from "@/lib/site-config"

import { defaultLocale, localePath, locales, type Locale } from "./config"
import { getLocale } from "./get-locale"

// Absolute URL of `path` ("/about") in the current request's language.
export async function localeUrl(path: string): Promise<string> {
  return `${siteConfig.url}${localePath(await getLocale(), path)}`
}

// Metadata `alternates` for a page: canonical in the current language plus
// an hreflang link per language (and x-default), so search engines index
// /en/about and /fr/about as translations of each other.
export async function localeAlternates(path: string) {
  const url = (locale: Locale) => `${siteConfig.url}${localePath(locale, path)}`
  return {
    canonical: url(await getLocale()),
    languages: {
      ...Object.fromEntries(locales.map((locale) => [locale, url(locale)])),
      "x-default": url(defaultLocale),
    },
  }
}

// openGraph.images for a page. Needed on every page that sets its own
// openGraph, because Next replaces the layout's openGraph wholesale rather
// than merging, which would drop the layout's opengraph-image. Twitter
// picks these up automatically.
export async function ogImages() {
  return [
    {
      url: localePath(await getLocale(), "/opengraph-image"),
      width: 1200,
      height: 630,
      alt: siteConfig.name,
    },
  ]
}
