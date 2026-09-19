"use client"

import { useActionState } from "react"
import { Loader2, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInAdmin, type LoginState } from "@/app/admin/login/actions"

const initialState: LoginState = { status: "idle" }

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(signInAdmin, initialState)

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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
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
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <LogIn data-icon="inline-end" />
          </>
        )}
      </Button>
    </form>
  )
}
