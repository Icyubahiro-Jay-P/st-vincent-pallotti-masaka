import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieConsentBanner } from "@/components/cookie-consent-banner"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { siteConfig } from "@/lib/site-config"
import { JsonLd } from "@/components/json-ld"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

// Every font-heading usage in the codebase pairs it with font-semibold and
// never italic (grep-verified), so only that one variant is loaded.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-serif",
})

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
    // en/fr content lives at the same URL (locale is cookie-driven, not a
    // path segment), so this can't point each language at a distinct URL
    // the way hreflang normally works — it just signals to crawlers that
    // both languages exist here at all, which is better than no signal.
    alternates: {
      languages: { en: siteConfig.url, fr: siteConfig.url },
    },
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
      url: siteConfig.url,
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const dict = getDictionary(locale)

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        "antialiased",
        "font-sans",
        inter.variable,
        fraunces.variable
      )}
    >
      <body className="flex min-h-svh flex-col">
        <JsonLd data={educationalOrganizationJsonLd} />
        <ThemeProvider>{children}</ThemeProvider>
        <CookieConsentBanner dict={dict} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
