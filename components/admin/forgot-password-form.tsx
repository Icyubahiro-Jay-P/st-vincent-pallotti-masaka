"use client"

import Link from "next/link"
import { useActionState } from "react"
import { ArrowLeft, Loader2, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  requestPasswordReset,
  type ForgotPasswordState,
} from "@/app/admin/login/forgot-password/actions"

const initialState: ForgotPasswordState = { status: "idle" }

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState
  )

  if (state.status === "done") {
    return (
      <div className="flex flex-col gap-5">
        <p
          role="status"
          className="border border-border bg-muted/40 px-4 py-3 text-xs text-foreground"
        >
          {state.message}
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-11 px-6 text-sm"
      >
        {pending ? (
          <>
            <Loader2 data-icon="inline-start" className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send reset link
            <Mail data-icon="inline-end" />
          </>
        )}
      </Button>

      <Link
        href="/admin/login"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>
    </form>
  )
}
