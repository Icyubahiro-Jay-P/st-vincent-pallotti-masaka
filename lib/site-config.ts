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
  { href: "/admissions", key: "admissions" },
  { href: "/contact", key: "contact" },
] as const

export const socialLinks = {
  instagram: "https://www.instagram.com/saintvincentpallottimasaka",
  youtube: "https://www.youtube.com/@saintvincentpallottimasaka",
  facebook: "https://www.facebook.com/saintvincentpallottimasaka",
} as const

// Structural program list: slug (matches dict.programs keys) + icon name.
// All translatable fields (name, ageRange, description, overview,
// highlights) live in dict.programs[slug].
export const programs = [
  { slug: "day-care", icon: "Baby" },
  { slug: "kindergarten", icon: "Blocks" },
  { slug: "special-needs", icon: "HeartHandshake" },
  { slug: "cambridge-primary", icon: "Globe2" },
  { slug: "national-primary", icon: "BookOpen" },
  { slug: "national-secondary", icon: "GraduationCap" },
  { slug: "tvet", icon: "Hammer" },
] as const

export type ProgramMeta = (typeof programs)[number]
export type ProgramSlug = ProgramMeta["slug"]

// TVET already has its own full page at /tvet; every other program gets a
// dedicated detail page at /academics/[slug].
export function programHref(slug: ProgramSlug): string {
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
