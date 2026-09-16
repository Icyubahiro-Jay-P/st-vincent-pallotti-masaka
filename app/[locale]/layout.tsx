import type { Metadata } from "next"
import { Fraunces, Geist_Mono, Inter } from "next/font/google"
import { notFound } from "next/navigation"

import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFab } from "@/components/whatsapp-fab"
import { cn } from "@/lib/utils"
import { locales, type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const siteUrl = "https://www.pallottimasaka.org"
const ogLocales: Record<Locale, string> = { en: "en_RW", fr: "fr_RW" }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) return {}
  const dict = getDictionary(locale as Locale)

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.home.title,
      template: `%s | ${dict.site.foundedBy.includes("Pallotti") ? "" : ""}Saint Vincent Pallotti School Masaka`,
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
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}/${l}`])
      ),
    },
    openGraph: {
      title: dict.meta.home.title,
      description: dict.meta.home.ogDescription,
      url: `${siteUrl}/${locale}`,
      siteName: "Saint Vincent Pallotti School Masaka",
      locale: ogLocales[locale as Locale],
      type: "website",
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params

  if (!locales.includes(localeParam as Locale)) {
    notFound()
  }

  const locale = localeParam as Locale
  const dict = getDictionary(locale)

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        fraunces.variable
      )}
    >
      <body className="flex min-h-svh flex-col">
        <ThemeProvider>
          <SiteHeader locale={locale} dict={dict} />
          <main className="flex-1">{children}</main>
          <SiteFooter locale={locale} dict={dict} />
          <WhatsAppFab dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  )
}
