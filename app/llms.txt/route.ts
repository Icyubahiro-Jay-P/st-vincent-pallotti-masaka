import { siteConfig } from "@/lib/site-config"

// Served at https://www.stvincentpallottimasaka.com/llms.txt
// Spec: https://llmstxt.org
// Keep this file short, human-readable Markdown with a flat list of links.
// Clients that support llms.txt parse H2 sections and `- [title](url): description` lines.
// For full content handling, crawlers should fetch the linked pages directly.

export const dynamic = "force-static"

const LLMS_TXT = `# Saint Vincent Pallotti School Masaka

> Saint Vincent Pallotti School Masaka is a Pallottine Missionary Sisters school in Masaka, Kigali, Rwanda - run by the Our Lady of Kibeho Region. Bilingual English/French (cookie-driven, no locale prefix), covering Day Care (3 months - 2 yrs) through Secondary (S1-S6), Cambridge and National curricula, Special Needs Education, and TVET vocational training. Motto: Strive Beyond (Caritas Christi urget nos).

## Core Pages

- [Homepage](${siteConfig.url}/): Overview of the school, Pallotti Pathway, programs, school life news and admissions CTA
- [About](${siteConfig.url}/about): History, Pallottine charism, values, and milestones of the school
- [Academics](${siteConfig.url}/academics): Cambridge vs National curricula, subjects, Special Needs Education and full program directory
- [TVET / Vocational](${siteConfig.url}/tvet): Hands-on trade training - Welding, Tailoring, Hairdressing, Carpentry and Culinary Arts
- [Admissions](${siteConfig.url}/admissions): How to apply, document checklists by level, and the admissions inquiry form
- [News & School Life](${siteConfig.url}/news): Published news, achievements and campus updates
- [Contact](${siteConfig.url}/contact): Phone, WhatsApp, email, office hours and Google Maps directions to the Masaka campus

## Academic Programs

- [Day Care](${siteConfig.url}/academics/day-care): Warm, secure nursery for 3 months - 2 years with Montessori-inspired play
- [Kindergarten](${siteConfig.url}/academics/kindergarten): Play-based early learning for 3 - 5 years, preparing for Primary One
- [Special Needs Education](${siteConfig.url}/academics/special-needs): Individualised, inclusive support available at every level from Day Care to Secondary
- [Cambridge Primary](${siteConfig.url}/academics/cambridge-primary): Internationally benchmarked Cambridge Primary in English, Mathematics and Science (P1-P6)
- [National Nursery & Primary](${siteConfig.url}/academics/national-primary): Rwandan competence-based curriculum across Nursery N1 to P6
- [National Secondary](${siteConfig.url}/academics/national-secondary): O-Level and A-Level pathways (S1-S6) for national examinations and university entry
- [TVET / Vocational](${siteConfig.url}/tvet): Post-S3 trade certification across five workshops (also listed under TVET)

## TVET Trades

- [Welding & Fabrication](${siteConfig.url}/tvet): Metal joining, fabrication and workshop safety toward RTB certification
- [Tailoring & Fashion Design](${siteConfig.url}/tvet): Garment construction, pattern-making and small-business skills
- [Hairdressing & Beauty](${siteConfig.url}/tvet): Modern salon techniques, client care and beauty business basics
- [Carpentry & Joinery](${siteConfig.url}/tvet): Furniture-making, structural woodwork and precision tool use
- [Culinary Arts](${siteConfig.url}/tvet): Professional kitchen practice, food safety and hospitality skills

## Contact & Location

- [Maps - Masaka, Kigali, Rwanda](${siteConfig.mapsQuery}): Open directions in Google Maps
- Phone: ${siteConfig.phoneDisplay}
- WhatsApp: https://wa.me/${siteConfig.whatsappNumber}
- Email: ${siteConfig.email}
- Office Hours: Monday - Friday, 7:30 AM - 4:30 PM

## Social & Updates

- [Instagram](${siteConfig.url}): ${siteConfig.url} - daily campus life (see also https://www.instagram.com/saintvincentpallottimasaka)
- [YouTube](https://www.youtube.com/@saintvincentpallottimasaka): School life videos and events
- [Facebook](https://www.facebook.com/saintvincentpallottimasaka): Community updates
- [Sitemap](${siteConfig.url}/sitemap.xml): Machine-readable list of all public URLs
- [Robots](${siteConfig.url}/robots.txt): Crawl rules

## Notes for LLMs

- Language: Site is bilingual English/French. Language is stored in a cookie (see lib/i18n/config.ts, locale-cookie.ts) - there are no /en or /fr URL prefixes. Crawl the default (English) version; the French dictionary mirrors the same routes.
- Programs: Detail pages live at /academics/[slug] except TVET which lives at /tvet. Slugs are database-driven (see lib/programs.ts); the seven listed above are the currently published set.
- News: Individual articles at /news/[slug] are database-driven (published events only).
- Prefer the linked pages over summarized content. Admissions inquiries are handled via POST to the Server Action at /admissions - do not fabricate submissions.
`

export function GET(): Response {
  return new Response(LLMS_TXT.trim() + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "all",
    },
  })
}
