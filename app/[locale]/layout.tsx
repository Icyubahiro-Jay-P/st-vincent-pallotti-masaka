import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CookieConsentBanner } from "@/components/cookie-consent-banner"
import { RootShell } from "@/components/root-shell"
import { isLocale, locales, type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { siteConfig } from "@/lib/site-config"
import { JsonLd } from "@/components/json-ld"

const ogLocales: Record<Locale, string> = { en: "en_RW", fr: "fr_RW" }

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = getDictionary(locale)

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: dict.meta.home.title,
      template: "%s | Saint Vincent Pallotti School Masaka",
    },
    description: dict.meta.home.description,
    keywords: [
      "Saint Vincent Pallotti School Masaka",
      "Pallotti Masaka",
      "school in Kigali Rwanda",
      "Cambridge school Rwanda",
      "TVET Rwanda",
      "Pallottine Missionary Sisters",
    ],
    openGraph: {
      title: dict.meta.home.title,
      description: dict.meta.home.ogDescription,
      url: `${siteConfig.url}/${locale}`,
      siteName: "Saint Vincent Pallotti School Masaka",
      locale: ogLocales[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.home.title,
      description: dict.meta.home.ogDescription,
    },
  }
}

const educationalOrganizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/badge.jpg`,
  telephone: siteConfig.phoneDisplay,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.location,
  },
}

// Prerenders /en and /fr at build time. Unknown first segments never reach
// here in practice, since proxy.ts prefixes them with a locale first.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Root layout of the public site. It sits under the [locale] segment so the
// language is part of every URL (/en/about, /fr/about) and getLocale() can
// read it via next/root-params. /admin has its own root layout.
export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <RootShell lang={locale}>
      <JsonLd data={educationalOrganizationJsonLd} />
      {children}
      <CookieConsentBanner dict={dict} />
    </RootShell>
  )
}
