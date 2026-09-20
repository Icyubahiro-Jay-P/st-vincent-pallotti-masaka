import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"

import { ValueForm } from "@/components/admin/value-form"
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb"
import { db } from "@/lib/db"
import { values } from "@/lib/db/schema"

export default async function EditValuePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [value] = await db
    .select()
    .from(values)
    .where(eq(values.id, Number(id)))

  if (!value) {
    notFound()
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <AdminBreadcrumb
        items={[
          { label: "Values", href: "/admin/values" },
          { label: "Edit value" },
        ]}
      />
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Edit value
      </h1>
      <ValueForm
        defaultValue={{
          id: value.id,
          icon: value.icon,
          position: value.position,
          isPublished: value.isPublished,
          titleEn: value.titleEn,
          titleFr: value.titleFr,
          descriptionEn: value.descriptionEn,
          descriptionFr: value.descriptionFr,
          needsTranslationReview: value.needsTranslationReview,
        }}
      />
    </div>
  )
}
