import { EventForm } from "@/components/admin/event-form"

export default function NewEventPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        New event
      </h1>
      <EventForm />
    </div>
  )
}
