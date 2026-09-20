import { eq } from "drizzle-orm"

import { HomepageContentForm } from "@/components/admin/homepage-content-form"
import { db } from "@/lib/db"
import { homepageContent } from "@/lib/db/schema"

export default async function AdminHomepagePage() {
  const [content] = await db
    .select()
    .from(homepageContent)
    .where(eq(homepageContent.id, 1))

  if (!content) {
    throw new Error(
      "homepage_content row is missing; run `npm run seed:homepage-content`"
    )
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Homepage content
      </h1>
      <HomepageContentForm defaults={content} />
    </div>
  )
}
