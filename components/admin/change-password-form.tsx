"use client"

import { useActionState, useEffect } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  changePassword,
  type ChangePasswordState,
} from "@/app/admin/(dashboard)/profile/actions"
import { passwordSchema } from "@/app/admin/(dashboard)/profile/schema"
import { PasswordInput } from "@/components/admin/password-input"
import { useToastOnActionState } from "@/components/admin/use-toast-on-action-state"
import { useFormValid } from "@/hooks/use-form-valid"

const initialState: ChangePasswordState = { status: "idle" }

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePassword,
    initialState
  )
  useToastOnActionState(state.status, state.message)
  const { formRef, valid, onChange, reset } = useFormValid(passwordSchema)

  useEffect(() => {
    if (state.status === "success") reset()
  }, [state, reset])

  return (
    <form
      ref={formRef}
      action={formAction}
      onChange={onChange}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="currentPassword">Current password</Label>
          <PasswordInput
            id="currentPassword"
            name="currentPassword"
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
          <PasswordInput
            id="newPassword"
            name="newPassword"
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
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
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
        disabled={pending || !valid}
        className="h-11 self-start px-6 text-sm"
      >
        {pending ? <Loader2 className="animate-spin" /> : null}
        Change password
      </Button>
    </form>
  )
}
