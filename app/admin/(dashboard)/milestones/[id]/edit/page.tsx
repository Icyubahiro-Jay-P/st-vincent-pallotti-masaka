import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"

import { MilestoneForm } from "@/components/admin/milestone-form"
import { db } from "@/lib/db"
import { milestones } from "@/lib/db/schema"

export default async function EditMilestonePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [milestone] = await db
    .select()
    .from(milestones)
    .where(eq(milestones.id, Number(id)))

  if (!milestone) {
    notFound()
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Edit milestone
      </h1>
      <MilestoneForm
        defaultMilestone={{
          id: milestone.id,
          icon: milestone.icon,
          position: milestone.position,
          isPublished: milestone.isPublished,
          yearEn: milestone.yearEn,
          yearFr: milestone.yearFr,
          titleEn: milestone.titleEn,
          titleFr: milestone.titleFr,
          descriptionEn: milestone.descriptionEn,
          descriptionFr: milestone.descriptionFr,
          needsTranslationReview: milestone.needsTranslationReview,
        }}
      />
    </div>
  )
}
