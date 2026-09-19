import { randomUUID } from "node:crypto"

import { hashPassword } from "better-auth/crypto"

import { db } from "@/lib/db"
import { account, admin } from "@/lib/db/schema"

// The only way an admin account is ever created: there is no public
// registration route anywhere in this app. Run once per new admin:
//   ADMIN_NAME="Jane Doe" ADMIN_EMAIL="jane@pallottimasaka.org" \
//   ADMIN_PASSWORD="a strong password" npm run seed:admin
// Inserts directly via Drizzle (mirroring what Better Auth's own sign-up
// handler does internally: an `admin` row + a linked `account` row with
// providerId "credential") rather than calling auth.api.signUpEmail,
// because emailAndPassword.disableSignUp is intentionally true in
// lib/auth.ts to keep sign-up unreachable even if an HTTP router for
// Better Auth is ever added later.
async function main() {
  const name = process.env.ADMIN_NAME
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!name || !email || !password) {
    console.error(
      "[seed-admin] set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD env vars"
    )
    process.exit(1)
  }
  if (password.length < 8) {
    console.error("[seed-admin] ADMIN_PASSWORD must be at least 8 characters")
    process.exit(1)
  }

  const id = randomUUID()
  const passwordHash = await hashPassword(password)

  await db.insert(admin).values({
    id,
    name,
    email,
    emailVerified: true,
  })

  await db.insert(account).values({
    id: randomUUID(),
    userId: id,
    providerId: "credential",
    accountId: id,
    password: passwordHash,
  })

  console.log(`[seed-admin] created admin ${email}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[seed-admin] failed:", error)
    process.exit(1)
  })
