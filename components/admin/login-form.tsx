"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Loader2, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInAdmin, type LoginState } from "@/app/admin/login/actions"
import { loginSchema } from "@/app/admin/login/schema"
import { PasswordInput } from "@/components/admin/password-input"
import { useFormValid } from "@/hooks/use-form-valid"

const initialState: LoginState = { status: "idle" }

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(signInAdmin, initialState)
  const { formRef, valid, onChange } = useFormValid(loginSchema)

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
        <div className="flex items-baseline justify-between gap-4">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/admin/login/forgot-password"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
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
