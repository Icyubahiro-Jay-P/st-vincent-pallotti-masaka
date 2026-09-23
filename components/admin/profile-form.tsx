"use client"

import { useActionState, useMemo } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  updateProfile,
  type UpdateProfileState,
} from "@/app/admin/(dashboard)/profile/actions"
import { profileSchema } from "@/app/admin/(dashboard)/profile/schema"
import { useToastOnActionState } from "@/components/admin/use-toast-on-action-state"
import { useFormValid } from "@/hooks/use-form-valid"

const initialState: UpdateProfileState = { status: "idle" }

export function ProfileForm({ defaults }: { defaults: { name: string } }) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState
  )
  useToastOnActionState(state.status, state.message)
  // Only savable when valid AND changed. defaults.name is the saved value
  // (the action revalidates this page), so a successful save moves the
  // baseline and disables the button again.
  const schema = useMemo(
    () => profileSchema.refine((data) => data.name !== defaults.name.trim()),
    [defaults.name]
  )
  const { formRef, valid, onChange } = useFormValid(schema)

  return (
    <form
      ref={formRef}
      action={formAction}
      onChange={onChange}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaults.name}
          key={defaults.name}
        />
        {state.fieldErrors?.name ? (
          <p className="text-[0.7rem] text-destructive">
            {state.fieldErrors.name}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={pending || !valid}
        className="h-11 self-start px-6 text-sm"
      >
        {pending ? <Loader2 className="animate-spin" /> : null}
        Save profile
      </Button>
    </form>
  )
}
