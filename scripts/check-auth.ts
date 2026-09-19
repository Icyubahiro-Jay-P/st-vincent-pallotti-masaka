import assert from "node:assert/strict"

import { auth } from "@/lib/auth"

// Smoke check for the seeded admin credentials: right password succeeds,
// wrong password is rejected. Safe to run outside a Next.js request
// context, since Better Auth's nextCookies plugin catches the "cookies()
// was called outside a request scope" error internally and no-ops.
async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error("[check-auth] set ADMIN_EMAIL and ADMIN_PASSWORD env vars")
    process.exit(1)
  }

  const result = await auth.api.signInEmail({ body: { email, password } })
  assert.ok(result.user, "expected sign-in with correct password to succeed")
  console.log("[check-auth] correct password: signed in ok")

  await assert.rejects(
    () =>
      auth.api.signInEmail({
        body: { email, password: `${password}-wrong` },
      }),
    "expected sign-in with wrong password to be rejected"
  )
  console.log("[check-auth] wrong password: correctly rejected")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[check-auth] failed:", error)
    process.exit(1)
  })
