import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { auth } from "@/lib/auth"

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
  if (PUBLIC_ADMIN_PATHS.has(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
