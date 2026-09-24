import { Fraunces, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

// Every font-heading usage in the codebase pairs it with font-semibold and
// never italic (grep-verified), so only that one variant is loaded.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-serif",
})

// The <html>/<body> shell shared by both root layouts: app/[locale]/layout.tsx
// (public site, language from the URL) and app/admin/layout.tsx (English only).
// There are two root layouts because the locale segment has to sit above the
// public root layout for next/root-params to work, and /admin has no locale.
export function RootShell({
  lang,
  children,
}: {
  lang: string
  children: React.ReactNode
}) {
  return (
    <html
      lang={lang}
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
        <script
          // Forget last visit's toggle so each full load follows the device
          // theme. Must run before next-themes' own script, which
          // ThemeProvider renders below.
          dangerouslySetInnerHTML={{
            __html: `try{localStorage.removeItem("theme")}catch(e){}`,
          }}
        />
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
