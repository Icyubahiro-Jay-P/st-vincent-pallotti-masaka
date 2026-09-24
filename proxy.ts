import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { auth } from "@/lib/auth"
import {
  defaultLocale,
  isLocale,
  localeFromAcceptLanguage,
  localePath,
} from "@/lib/i18n/config"
import { LOCALE_COOKIE } from "@/lib/i18n/locale-cookie"

// Next.js 16 renamed middleware.ts to proxy.ts; it defaults to the Node.js
// runtime (confirmed in node_modules/next's own docs), so calling
// getSession here (a real DB round trip, gated by Better Auth's cookie
// cache) has no edge-runtime restrictions to work around.
const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/login",
  "/admin/login/forgot-password",
  "/admin/reset-password",
])

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "") || "/"
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return adminGate(request, pathname)
  }

  // Public pages live under a locale segment (app/[locale]). Anything
  // without one (/, /about, old links, newsletter emails, search results
  // from before the switch) gets sent to the visitor's language: the
  // switcher's cookie, then Accept-Language, then English. 307 rather than
  // 308 because the target depends on the visitor, so it must not be cached
  // as permanent.
  const first = pathname.split("/")[1]
  if (first && isLocale(first)) return NextResponse.next()

  const cookieValue = request.cookies.get(LOCALE_COOKIE)?.value
  const locale =
    (cookieValue && isLocale(cookieValue) ? cookieValue : null) ??
    localeFromAcceptLanguage(request.headers.get("accept-language")) ??
    defaultLocale
  const url = request.nextUrl.clone()
  url.pathname = localePath(locale, pathname)
  return NextResponse.redirect(url, 307)
}

async function adminGate(request: NextRequest, pathname: string) {
  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Everything except Next internals, API routes and files with an
  // extension (robots.txt, sitemap.xml, llms.txt, icons, /public assets).
  matcher: "/((?!_next/|api/|.*\\..*).*)",
}
