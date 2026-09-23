"use client"

import { useActionState } from "react"
import { KeyRound, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  resetPassword,
  type ResetPasswordState,
} from "@/app/admin/reset-password/actions"
import { resetPasswordSchema } from "@/app/admin/reset-password/schema"
import { PasswordInput } from "@/components/admin/password-input"
import { useFormValid } from "@/hooks/use-form-valid"

const initialState: ResetPasswordState = { status: "idle" }

export function ResetPasswordForm({ token }: { token?: string }) {
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState
  )
  const { formRef, valid, onChange } = useFormValid(resetPasswordSchema)

  if (!token) {
    return (
      <p
        role="alert"
        className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"
      >
        This reset link is invalid or has expired. Request a new one from the
        sign-in page.
      </p>
    )
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onChange={onChange}
      noValidate
      className="flex flex-col gap-5"
    >
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"
        >
          {state.message}
        </p>
      )}

      <input type="hidden" name="token" value={token} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="newPassword">New password</Label>
        <PasswordInput
          id="newPassword"
          name="newPassword"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={pending || !valid}
        className="h-11 px-6 text-sm"
      >
        {pending ? (
          <>
            <Loader2 data-icon="inline-start" className="animate-spin" />
            Saving…
          </>
        ) : (
          <>
            Set new password
            <KeyRound data-icon="inline-end" />
          </>
        )}
      </Button>
    </form>
  )
}
