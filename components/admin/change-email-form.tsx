"use client"

import { useActionState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  changeEmail,
  type ChangeEmailState,
} from "@/app/admin/(dashboard)/profile/actions"
import { useToastOnActionState } from "@/components/admin/use-toast-on-action-state"

const initialState: ChangeEmailState = { status: "idle" }

export function ChangeEmailForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, formAction, pending] = useActionState(changeEmail, initialState)
  useToastOnActionState(state.status, state.message)

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5 sm:max-w-xs">
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
        disabled={pending}
        className="h-11 self-start px-6 text-sm"
      >
        {pending ? <Loader2 className="animate-spin" /> : null}
        Update email
      </Button>
    </form>
  )
}
