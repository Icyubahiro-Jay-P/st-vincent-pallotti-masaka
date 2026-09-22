# Saint Vincent Pallotti School Masaka, Website

A demo marketing and admissions website built for Saint Vincent Pallotti School Masaka, a Catholic school in Masaka, Kigali, Rwanda run by the Pallottine Missionary Sisters. The goal of this demo is to replace the school's broken website link on Google Business and Facebook with a fast, professional, mobile first site that covers admissions, academics, TVET, and school life.

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React 19 and TypeScript
- Tailwind CSS v4
- shadcn/ui (base-ui primitives, Sera style)
- Lucide icons

## Key Features

- Bilingual English and French. Language is stored in a cookie and switched with the language selector in the header, no page reload or URL change required.
- Light and dark mode, following the visitor's system preference by default, toggled with the sun and moon icon in the header (or the "d" key).
- A working admissions inquiry form backed by a Next.js Server Action, with field validation and a success confirmation state.
- A dedicated page for every academic program (Day Care, Kindergarten, Special Needs Education, Cambridge Primary, National Primary, National Secondary), each with its own URL, age range, overview, and highlights.
- A floating WhatsApp button and a Google Maps link for quick contact.
- Mobile first, responsive layout down to small phone widths.
- SEO basics: sitemap.xml, robots.txt, and per page metadata.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in a browser.

Other scripts:

```bash
npm run build       # production build
npm run start        # run the production build
npm run typecheck   # TypeScript check with no output files
npm run lint          # ESLint
npm run format       # Prettier
```

## Project Structure

```
app/                  Pages (App Router). Routes carry no locale prefix.
  page.tsx             Homepage
  about/
  academics/           Academics hub, plus academics/[slug] for each program
  tvet/
  admissions/          Admissions page and its Server Action
  news/
  contact/
  layout.tsx           Root layout: fonts, theme, header, footer
  globals.css          Design tokens (colors, spacing) for light and dark mode

components/
  ui/                  Generated shadcn/ui components, do not hand edit lightly
  home/                Homepage sections (hero, pathway, programs, and so on)
  patterns/            Decorative Rwandan Imigongo inspired graphics
  admissions/          The admissions inquiry form
  site-header.tsx, site-footer.tsx, language-switcher.tsx, theme-toggle.tsx

lib/
  site-config.ts       Locale independent data: routes, contact info, program list, icons
  i18n/
    config.ts            Supported locales
    dictionaries/en.ts, fr.ts   All translated copy for the site
    get-dictionary.ts    Looks up the right dictionary for a locale
    get-locale.ts        Reads the visitor's language cookie (server only)
    locale-cookie.ts     The cookie name, safe to import from client code too
```

## Adding or Changing Text

All visible copy lives in `lib/i18n/dictionaries/en.ts` and `fr.ts`. The English file is the source of truth for shape: TypeScript will show an error in `fr.ts` if a key is missing or misspelled, so it is difficult to accidentally ship an untranslated page.

To add a third language, for example Kinyarwanda:

1. Copy `lib/i18n/dictionaries/fr.ts` to `lib/i18n/dictionaries/rw.ts` and translate every value, keeping every key the same.
2. Add `"rw"` to the `locales` array in `lib/i18n/config.ts` and to `localeNames`.
3. Register the new dictionary in `lib/i18n/get-dictionary.ts`.

The language switcher and routing pick up the new language automatically, no other changes are needed.

## Things to Replace Before Going Live

A few values are placeholders for this demo and should be swapped for the school's real details in `lib/site-config.ts`:

- `phoneDisplay` and `phoneHref`, currently a placeholder Rwandan format number.
- `whatsappNumber`, used by the floating WhatsApp button.
- `email`, currently `admissions@pallottimasaka.org`.

The admissions form (`app/admissions/actions.ts`) currently validates a submission and logs it on the server. Before accepting real inquiries, connect it to an email service such as Resend or Formspree, or to a database.

## Deployment

The site is a standard Next.js app and deploys cleanly to Vercel. Pages that read the language cookie are rendered dynamically rather than statically prerendered, which is expected and still fast.

Deploys are blue-green (see `.github/workflows/deploy.yml`): every push to `main` is built once, deployed as an isolated, non-production deployment, smoke-tested (`scripts/smoke-test.mjs`), and only promoted to the production domain if that passes. The previous production deployment ("blue") stays untouched and instantly re-promotable.

### Rollback

1. Find the previous production deployment: `vercel ls stvincentpallottimasaka --token=$VERCEL_TOKEN`, or Vercel dashboard → Deployments → filter Production → the one before the current one.
2. Roll back: `vercel rollback --token=$VERCEL_TOKEN` (go back one), or `vercel promote <deployment-url-or-id> --token=$VERCEL_TOKEN --yes` (roll back to any specific past deployment).
3. Either way this reassigns the production alias only — no rebuild, as fast as the original promote.
4. If the rollback was due to a schema-incompatible migration, see `MIGRATIONS.md` first — don't try to reverse the migration in a panic; expand/contract discipline should already make the rolled-back code compatible with the current schema.

## Domain

No domain has been purchased yet. Recommended options, in order of preference: a `.org` domain, a Rwandan `.ac.rw` or `.org.rw` domain for local credibility, or a `.com` as a safe fallback.
