import { cookies, headers } from "next/headers"

import { defaultLocale, isLocale, locales, type Locale } from "./config"
import { LOCALE_COOKIE } from "./locale-cookie"

// Picks the first Accept-Language entry (already sent in q-weighted order
// by the browser) whose base language we support. Used only as a fallback
// for visitors with no locale cookie yet  bots and first-time visits that
// never run the client-side language switcher.
function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase()
    const base = tag?.split("-")[0]
    if (base && (locales as readonly string[]).includes(base)) {
      return base as Locale
    }
  }
  return null
}

// Reads the visitor's language preference from a cookie instead of the URL,
// so pages live at plain paths like /about rather than /en/about or
// /fr/about. Falls back to Accept-Language, then the default locale, when
// no cookie is set yet. Because this reads a per-request cookie/header,
// every page that calls it is rendered dynamically (Next.js can't
// statically prerender content that depends on either), a fair trade for
// not needing a URL segment.
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const cookieValue = store.get(LOCALE_COOKIE)?.value
  if (cookieValue && isLocale(cookieValue)) return cookieValue

  const acceptLanguage = (await headers()).get("accept-language")
  return localeFromAcceptLanguage(acceptLanguage) ?? defaultLocale
}
