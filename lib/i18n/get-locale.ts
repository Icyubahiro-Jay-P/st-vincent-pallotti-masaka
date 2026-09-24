import { cookies, headers } from "next/headers"
import { locale as localeParam } from "next/root-params"

import {
  defaultLocale,
  isLocale,
  localeFromAcceptLanguage,
  type Locale,
} from "./config"
import { LOCALE_COOKIE } from "./locale-cookie"

// The language comes from the URL (/en/about, /fr/about): every public page
// sits under app/[locale], so next/root-params can read it from any Server
// Component without prop drilling, and pages can still render statically.
//
// Server Actions can't read root params (per Next's docs), so for those
// (admissions form, newsletter signup) this falls back to the locale prefix
// of the page the form was posted from, then the cookie the language
// switcher sets, then Accept-Language.
export async function getLocale(): Promise<Locale> {
  try {
    const value = await localeParam()
    if (value && isLocale(value)) return value
  } catch {
    // Not in a Server Component render (e.g. a Server Action), see above.
  }

  const headerStore = await headers()
  const referer = headerStore.get("referer")
  if (referer) {
    const first = new URL(referer).pathname.split("/")[1]
    if (first && isLocale(first)) return first
  }

  const cookieValue = (await cookies()).get(LOCALE_COOKIE)?.value
  if (cookieValue && isLocale(cookieValue)) return cookieValue

  return (
    localeFromAcceptLanguage(headerStore.get("accept-language")) ??
    defaultLocale
  )
}
