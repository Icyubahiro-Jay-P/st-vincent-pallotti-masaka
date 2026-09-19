import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

// Called at the top of every mutating admin server action as defense in
// depth. proxy.ts already gates page navigation to /admin/**, but per
// Next's own docs, Server Actions aren't covered by a proxy matcher (they
// route as POSTs to the page they're called from), so a matcher change
// could silently remove that coverage without this second check.
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect("/admin/login")
  }
  return session
}
