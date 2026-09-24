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
