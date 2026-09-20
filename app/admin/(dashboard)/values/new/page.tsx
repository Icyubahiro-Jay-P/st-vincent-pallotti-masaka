import { ValueForm } from "@/components/admin/value-form"
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb"
import { db } from "@/lib/db"
import { values } from "@/lib/db/schema"

export default async function NewValuePage() {
  const existing = await db.select({ id: values.id }).from(values)

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <AdminBreadcrumb
        items={[
          { label: "Values", href: "/admin/values" },
          { label: "New value" },
        ]}
      />
      <h1 className="font-heading text-xl font-semibold text-foreground">
        New value
      </h1>
      <ValueForm defaultPosition={existing.length} />
    </div>
  )
}
