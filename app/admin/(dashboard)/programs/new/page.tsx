import { ProgramForm } from "@/components/admin/program-form"
import { db } from "@/lib/db"
import { programs } from "@/lib/db/schema"

export default async function NewProgramPage() {
  const existing = await db.select({ id: programs.id }).from(programs)

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        New program
      </h1>
      <ProgramForm defaultPosition={existing.length} />
    </div>
  )
}
