import { MilestoneForm } from "@/components/admin/milestone-form"
import { db } from "@/lib/db"
import { milestones } from "@/lib/db/schema"

export default async function NewMilestonePage() {
  const existing = await db.select({ id: milestones.id }).from(milestones)

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        New milestone
      </h1>
      <MilestoneForm defaultPosition={existing.length} />
    </div>
  )
}
