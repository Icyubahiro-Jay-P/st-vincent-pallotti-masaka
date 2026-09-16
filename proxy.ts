import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { defaultLocale, locales } from "@/lib/i18n/config"

// Redirects any path without a locale prefix to the default locale, e.g.
// "/" -> "/en" and "/admissions" -> "/en/admissions". This keeps old links
// (Google Business, social bios, the sitemap) working while every real page
// lives under /[locale]. Named `proxy` (not `middleware`) per the Next.js 16
// convention: see node_modules/next/dist/docs/.../version-16.md.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (hasLocale) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Skip _next internals and any request for a file with an extension
  // (images, icons, robots.txt, sitemap.xml, etc.) so static assets in
  // public/ are served directly instead of being redirected under /en.
  matcher: ["/((?!_next|.*\\..*).*)"],
}
