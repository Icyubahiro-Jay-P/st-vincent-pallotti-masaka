// Locale-independent structure: routes, icons, contact facts and other data
// that doesn't change between languages. Translatable copy (nav labels,
// program names/descriptions, page content) lives in lib/i18n/dictionaries
// instead, see that folder when you need to change wording. Routes carry no
// locale prefix (language is a cookie, not a URL segment) so hrefs are
// plain paths.

export const siteConfig = {
  name: "Saint Vincent Pallotti School Masaka",
  shortName: "Pallotti Masaka",
  url: "https://www.stvincentpallottimasaka.com",
  motto: "Strive Beyond",
  spiritualMottoLatin: "Caritas Christi urget nos",
  location: "Masaka, Kigali, Rwanda",
  phoneDisplay: "+250 788 602 647",
  phoneHref: "+250788602647",
  whatsappNumber: "250788602647",
  email: "admissions@stvincentpallottimasaka.com",
  mapsQuery:
    "https://www.google.com/maps/search/?api=1&query=Saint+Vincent+Pallotti+School+Masaka+Kigali+Rwanda",
} as const

// nav labels come from dict.nav[key] so the header/footer can render them
// in any language.
export const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/academics", key: "academics" },
  { href: "/tvet", key: "tvet" },
  { href: "/news", key: "news" },
  { href: "/gallery", key: "gallery" },
  { href: "/admissions", key: "admissions" },
  { href: "/contact", key: "contact" },
] as const

export const socialLinks = {
  instagram: "https://www.instagram.com/saintvincentpallottimasaka",
  youtube: "https://www.youtube.com/@saintvincentpallottimasaka",
  facebook: "https://www.facebook.com/saintvincentpallottimasaka",
} as const

// Programs now live in the `programs` DB table (see lib/programs.ts) rather
// than a hardcoded array here. This helper stays because routing still
// needs the same tvet special-case regardless of where the slug came from.
// TVET already has its own full page at /tvet; every other program gets a
// dedicated detail page at /academics/[slug].
export function programHref(slug: string): string {
  return slug === "tvet" ? "/tvet" : `/academics/${slug}`
}

// Structural TVET trade list: name/description text lives in
// dict.tvet.trades (same order).
export const tvetTradeIcons = [
  "Flame",
  "Scissors",
  "Sparkles",
  "Hammer",
  "ChefHat",
] as const

// Structural pathway step numbers: stage/range/description text lives in
// dict.home.pathway.steps (same order).
export const pathwaySteps = ["01", "02", "03", "04", "05"] as const
