"use client"

import { useActionState, useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  changePassword,
  type ChangePasswordState,
} from "@/app/admin/(dashboard)/profile/actions"
import { useToastOnActionState } from "@/components/admin/use-toast-on-action-state"

const initialState: ChangePasswordState = { status: "idle" }

export function ChangePasswordForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState(
    changePassword,
    initialState
  )
  useToastOnActionState(state.status, state.message)

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset()
  }, [state])

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="currentPassword">Current password</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
          />
          {state.fieldErrors?.currentPassword ? (
            <p className="text-[0.7rem] text-destructive">
              {state.fieldErrors.currentPassword}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
          />
          {state.fieldErrors?.newPassword ? (
            <p className="text-[0.7rem] text-destructive">
              {state.fieldErrors.newPassword}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
          />
          {state.fieldErrors?.confirmPassword ? (
            <p className="text-[0.7rem] text-destructive">
              {state.fieldErrors.confirmPassword}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="revokeOtherSessions"
          name="revokeOtherSessions"
          type="checkbox"
          className="size-4 accent-primary"
        />
        <Label htmlFor="revokeOtherSessions" className="font-normal">
          Sign out other devices
        </Label>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-11 self-start px-6 text-sm"
      >
        {pending ? <Loader2 className="animate-spin" /> : null}
        Change password
      </Button>
    </form>
  )
}
