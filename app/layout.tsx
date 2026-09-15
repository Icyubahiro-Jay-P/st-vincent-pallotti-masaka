import type { Metadata } from "next"
import { Fraunces, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFab } from "@/components/whatsapp-fab"
import { cn } from "@/lib/utils"

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Saint Vincent Pallotti School Masaka | Strive Beyond",
    template: "%s | Saint Vincent Pallotti School Masaka",
  },
  description:
    "Saint Vincent Pallotti School Masaka is a Pallottine Missionary Sisters school in Masaka, Kigali offering Day Care, Kindergarten, Cambridge Primary, National Nursery, Primary & Secondary, Special Needs Education and TVET vocational training.",
  keywords: [
    "Saint Vincent Pallotti School Masaka",
    "Pallotti Masaka",
    "school in Kigali Rwanda",
    "Cambridge school Rwanda",
    "TVET Rwanda",
    "Pallottine Missionary Sisters",
  ],
  openGraph: {
    title: "Saint Vincent Pallotti School Masaka | Strive Beyond",
    description:
      "A Pallottine Missionary Sisters school in Masaka, Kigali — Day Care through Secondary, Cambridge and National curricula, Special Needs Education, and TVET.",
    url: siteUrl,
    siteName: "Saint Vincent Pallotti School Masaka",
    locale: "en_RW",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
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
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <WhatsAppFab />
        </ThemeProvider>
      </body>
    </html>
  )
}
