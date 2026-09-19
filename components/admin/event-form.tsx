"use client"

import { useActionState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveEvent, type EventFormState } from "@/app/admin/events/actions"

const initialState: EventFormState = { status: "idle" }

export type EventFormDefaults = {
  id: number
  titleEn: string
  titleFr: string
  excerptEn: string
  excerptFr: string
  bodyEn: string
  bodyFr: string
  category: string
}

export function EventForm({
  defaultEvent,
}: {
  defaultEvent?: EventFormDefaults
}) {
  const [state, formAction, pending] = useActionState(saveEvent, initialState)

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {defaultEvent && (
        <input type="hidden" name="id" value={defaultEvent.id} />
      )}

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"
        >
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Title (English)"
          htmlFor="titleEn"
          error={state.fieldErrors?.titleEn}
        >
          <Input
            id="titleEn"
            name="titleEn"
            defaultValue={defaultEvent?.titleEn}
          />
        </Field>
        <Field
          label="Title (French)"
          htmlFor="titleFr"
          error={state.fieldErrors?.titleFr}
        >
          <Input
            id="titleFr"
            name="titleFr"
            defaultValue={defaultEvent?.titleFr}
          />
        </Field>
        <Field
          label="Excerpt (English)"
          htmlFor="excerptEn"
          error={state.fieldErrors?.excerptEn}
        >
          <Input
            id="excerptEn"
            name="excerptEn"
            defaultValue={defaultEvent?.excerptEn}
          />
        </Field>
        <Field
          label="Excerpt (French)"
          htmlFor="excerptFr"
          error={state.fieldErrors?.excerptFr}
        >
          <Input
            id="excerptFr"
            name="excerptFr"
            defaultValue={defaultEvent?.excerptFr}
          />
        </Field>
        <Field
          label="Category"
          htmlFor="category"
          error={state.fieldErrors?.category}
        >
          <Input
            id="category"
            name="category"
            placeholder="School Life, Academics, TVET…"
            defaultValue={defaultEvent?.category}
          />
        </Field>
        <Field label="Cover image (optional)" htmlFor="coverImage">
          <input
            id="coverImage"
            name="coverImage"
            type="file"
            accept="image/*"
            className="text-xs"
          />
        </Field>
      </div>

      <Field
        label="Body (English)"
        htmlFor="bodyEn"
        error={state.fieldErrors?.bodyEn}
      >
        <Textarea
          id="bodyEn"
          name="bodyEn"
          rows={8}
          defaultValue={defaultEvent?.bodyEn}
        />
      </Field>
      <Field
        label="Body (French)"
        htmlFor="bodyFr"
        error={state.fieldErrors?.bodyFr}
      >
        <Textarea
          id="bodyFr"
          name="bodyFr"
          rows={8}
          defaultValue={defaultEvent?.bodyFr}
        />
      </Field>

      <div className="flex gap-3">
        <Button
          type="submit"
          name="intent"
          value="draft"
          variant="outline"
          disabled={pending}
          className="h-11 px-6 text-sm"
        >
          {pending ? <Loader2 className="animate-spin" /> : null}
          Save draft
        </Button>
        <Button
          type="submit"
          name="intent"
          value="publish"
          disabled={pending}
          className="h-11 px-6 text-sm"
        >
          {pending ? <Loader2 className="animate-spin" /> : null}
          Publish
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-[0.7rem] text-destructive">{error}</p> : null}
    </div>
  )
}
