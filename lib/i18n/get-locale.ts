import { cookies } from "next/headers"

import { defaultLocale, isLocale, type Locale } from "./config"
import { LOCALE_COOKIE } from "./locale-cookie"

// Reads the visitor's language preference from a cookie instead of the URL,
// so pages live at plain paths like /about rather than /en/about or
// /fr/about. Falls back to the default locale when no cookie is set yet.
// Because this reads a per-request cookie, every page that calls it is
// rendered dynamically (Next.js can't statically prerender content that
// depends on a cookie), a fair trade for not needing a URL segment.
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return value && isLocale(value) ? value : defaultLocale
}
