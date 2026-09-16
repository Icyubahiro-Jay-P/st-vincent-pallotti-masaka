import type { Metadata } from "next"
import { Fraunces, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFab } from "@/components/whatsapp-fab"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"

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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = getDictionary(locale)

  return {
    metadataBase: new URL(siteUrl),
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
      url: siteUrl,
      siteName: "Saint Vincent Pallotti School Masaka",
      locale: ogLocales[locale],
      type: "website",
    },
  }
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
        fontMono.variable,
        "font-sans",
        inter.variable,
        fraunces.variable
      )}
    >
      <body className="flex min-h-svh flex-col">
        <ThemeProvider>
          <SiteHeader dict={dict} />
          <main className="flex-1">{children}</main>
          <SiteFooter dict={dict} />
          <WhatsAppFab dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  )
}
