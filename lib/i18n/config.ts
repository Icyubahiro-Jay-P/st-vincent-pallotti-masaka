// Adding a language: create dictionaries/<code>.ts (copy fr.ts, translate
// every value, keep every key), add it to the `locales` array and
// `localeNames` below, then import and register it in get-dictionary.ts.
// TypeScript will error on any missing key because every dictionary is
// typed against the English one.

export const locales = ["en", "fr"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

// Picks the first Accept-Language entry (already sent in q-weighted order
// by the browser) whose base language we support. Pure so proxy.ts can use
// it too, when redirecting an unprefixed URL like /about.
export function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null
  for (const part of header.split(",")) {
    const base = part.split(";")[0]?.trim().toLowerCase().split("-")[0]
    if (base && isLocale(base)) return base
  }
  return null
}

// "/about" -> "/fr/about", "/" -> "/fr". Every public page lives under a
// locale segment (app/[locale]), so each language has its own URL.
export function localePath(locale: Locale, path: string): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`
}

// "/fr/about" -> "/about", "/fr" -> "/". Paths without a locale pass through.
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/")
  if (!first || !isLocale(first)) return pathname
  return rest.length ? `/${rest.join("/")}` : "/"
}
