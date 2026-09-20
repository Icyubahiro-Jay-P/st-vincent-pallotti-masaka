"use client"

import * as React from "react"
import { useActionState } from "react"
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  resetPassword,
  type ResetPasswordState,
} from "@/app/admin/reset-password/actions"

const initialState: ResetPasswordState = { status: "idle" }

export function ResetPasswordForm({ token }: { token?: string }) {
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState
  )
  const [showPasswords, setShowPasswords] = React.useState(false)
  const fieldType = showPasswords ? "text" : "password"

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
    <form action={formAction} noValidate className="flex flex-col gap-5">
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
        <Input
          id="newPassword"
          name="newPassword"
          type={fieldType}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={fieldType}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <button
        type="button"
        onClick={() => setShowPasswords((prev) => !prev)}
        className="flex items-center gap-1.5 self-start text-xs text-muted-foreground hover:text-foreground"
      >
        {showPasswords ? (
          <EyeOff className="size-3.5" />
        ) : (
          <Eye className="size-3.5" />
        )}
        {showPasswords ? "Hide passwords" : "Show passwords"}
      </button>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
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
