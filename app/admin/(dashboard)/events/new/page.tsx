import { EventForm } from "@/components/admin/event-form"
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb"

export default function NewEventPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <AdminBreadcrumb
        items={[
          { label: "Events", href: "/admin/events" },
          { label: "New event" },
        ]}
      />
      <h1 className="font-heading text-xl font-semibold text-foreground">
        New event
      </h1>
      <EventForm />
    </div>
  )
}
