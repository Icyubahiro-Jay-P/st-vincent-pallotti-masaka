import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"

import { ProgramForm } from "@/components/admin/program-form"
import { db } from "@/lib/db"
import { programs } from "@/lib/db/schema"

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [program] = await db
    .select()
    .from(programs)
    .where(eq(programs.id, Number(id)))

  if (!program) {
    notFound()
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Edit program
      </h1>
      <ProgramForm
        defaultProgram={{
          id: program.id,
          icon: program.icon,
          position: program.position,
          isPublished: program.isPublished,
          nameEn: program.nameEn,
          nameFr: program.nameFr,
          ageRangeEn: program.ageRangeEn,
          ageRangeFr: program.ageRangeFr,
          descriptionEn: program.descriptionEn,
          descriptionFr: program.descriptionFr,
          overviewEn: program.overviewEn,
          overviewFr: program.overviewFr,
          highlightsEn: program.highlightsEn,
          highlightsFr: program.highlightsFr,
          needsTranslationReview: program.needsTranslationReview,
        }}
      />
    </div>
  )
}
