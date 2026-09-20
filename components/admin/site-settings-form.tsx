"use client"

import { useActionState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  updateSiteSettings,
  type SiteSettingsFormState,
} from "@/app/admin/(dashboard)/settings/actions"

const initialState: SiteSettingsFormState = { status: "idle" }

export type SiteSettingsDefaults = {
  phoneDisplay: string
  phoneHref: string
  whatsappNumber: string
  email: string
  mapsQuery: string
  location: string
  motto: string
  spiritualMottoLatin: string
  instagramUrl: string
  youtubeUrl: string
  facebookUrl: string
}

export function SiteSettingsForm({
  defaults,
}: {
  defaults: SiteSettingsDefaults
}) {
  const [state, formAction, pending] = useActionState(
    updateSiteSettings,
    initialState
  )

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"
        >
          {state.message}
        </p>
      )}

      {state.status === "success" && state.message && (
        <p
          role="status"
          className="border border-primary/30 bg-primary/10 px-4 py-3 text-xs text-foreground"
        >
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Phone (display)"
          name="phoneDisplay"
          defaultValue={defaults.phoneDisplay}
          error={state.fieldErrors?.phoneDisplay}
        />
        <Field
          label="Phone (tel: link)"
          name="phoneHref"
          defaultValue={defaults.phoneHref}
          error={state.fieldErrors?.phoneHref}
        />
        <Field
          label="WhatsApp number"
          name="whatsappNumber"
          defaultValue={defaults.whatsappNumber}
          error={state.fieldErrors?.whatsappNumber}
        />
        <Field
          label="Contact email"
          name="email"
          type="email"
          defaultValue={defaults.email}
          error={state.fieldErrors?.email}
        />
        <Field
          label="Location"
          name="location"
          defaultValue={defaults.location}
          error={state.fieldErrors?.location}
        />
        <Field
          label="Google Maps link"
          name="mapsQuery"
          defaultValue={defaults.mapsQuery}
          error={state.fieldErrors?.mapsQuery}
        />
        <Field
          label="Motto"
          name="motto"
          defaultValue={defaults.motto}
          error={state.fieldErrors?.motto}
        />
        <Field
          label="Spiritual motto (Latin)"
          name="spiritualMottoLatin"
          defaultValue={defaults.spiritualMottoLatin}
          error={state.fieldErrors?.spiritualMottoLatin}
        />
        <Field
          label="Instagram URL"
          name="instagramUrl"
          defaultValue={defaults.instagramUrl}
          error={state.fieldErrors?.instagramUrl}
        />
        <Field
          label="YouTube URL"
          name="youtubeUrl"
          defaultValue={defaults.youtubeUrl}
          error={state.fieldErrors?.youtubeUrl}
        />
        <Field
          label="Facebook URL"
          name="facebookUrl"
          defaultValue={defaults.facebookUrl}
          error={state.fieldErrors?.facebookUrl}
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-11 self-start px-6 text-sm"
      >
        {pending ? <Loader2 className="animate-spin" /> : null}
        Save settings
      </Button>
    </form>
  )
}

function Field({
  label,
  name,
  defaultValue,
  error,
  type = "text",
}: {
  label: string
  name: string
  defaultValue: string
  error?: string
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} />
      {error ? <p className="text-[0.7rem] text-destructive">{error}</p> : null}
    </div>
  )
}
