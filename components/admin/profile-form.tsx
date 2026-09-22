"use client"

import { useActionState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  updateProfile,
  type UpdateProfileState,
} from "@/app/admin/(dashboard)/profile/actions"
import { useToastOnActionState } from "@/components/admin/use-toast-on-action-state"

const initialState: UpdateProfileState = { status: "idle" }

export function ProfileForm({ defaults }: { defaults: { name: string } }) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState
  )
  useToastOnActionState(state.status, state.message)

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-11 self-start px-6 text-sm"
      >
        {pending ? <Loader2 className="animate-spin" /> : null}
        Save profile
      </Button>
    </form>
  )
}
