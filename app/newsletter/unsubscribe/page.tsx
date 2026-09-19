import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { newsletterSubscribers } from "@/lib/db/schema"

// A GET-triggered write is the standard, accepted pattern for a one-click
// email unsubscribe link: the token itself is the auth, and there's no
// destructive side effect an attacker could weaponize by getting someone
// to click it (at worst, it unsubscribes an email that wasn't theirs).
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  let unsubscribed = false
  if (token) {
    const result = await db
      .update(newsletterSubscribers)
      .set({ unsubscribedAt: new Date() })
      .where(eq(newsletterSubscribers.unsubscribeToken, token))
      .returning({ id: newsletterSubscribers.id })
    unsubscribed = result.length > 0
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        {unsubscribed ? "You're unsubscribed" : "Link not recognized"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {unsubscribed
          ? "You won't receive further newsletter emails from us. / Vous ne recevrez plus nos e-mails."
          : "This unsubscribe link is invalid or has already been used."}
      </p>
    </div>
  )
}
