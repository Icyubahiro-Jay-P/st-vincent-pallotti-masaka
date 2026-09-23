"use client"

import { useActionState, useMemo } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  changeEmail,
  type ChangeEmailState,
} from "@/app/admin/(dashboard)/profile/actions"
import { changeEmailSchema } from "@/app/admin/(dashboard)/profile/schema"
import { useToastOnActionState } from "@/components/admin/use-toast-on-action-state"
import { useFormValid } from "@/hooks/use-form-valid"

const initialState: ChangeEmailState = { status: "idle" }

export function ChangeEmailForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, formAction, pending] = useActionState(changeEmail, initialState)
  useToastOnActionState(state.status, state.message)
  // Same valid-and-changed rule as ProfileForm; defaultEmail updates after a
  // successful change since the action revalidates this page.
  const schema = useMemo(
    () =>
      changeEmailSchema.refine(
        (data) => data.email.trim() !== defaultEmail.trim()
      ),
    [defaultEmail]
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={defaultEmail}
          key={defaultEmail}
        />
        {state.fieldErrors?.email ? (
          <p className="text-[0.7rem] text-destructive">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="emailRevokeOtherSessions"
          name="revokeOtherSessions"
          type="checkbox"
          className="size-4 accent-primary"
        />
        <Label htmlFor="emailRevokeOtherSessions" className="font-normal">
          Sign out other devices
        </Label>
      </div>

      <Button
        type="submit"
        disabled={pending || !valid}
        className="h-11 self-start px-6 text-sm"
      >
        {pending ? <Loader2 className="animate-spin" /> : null}
        Update email
      </Button>
    </form>
  )
}
