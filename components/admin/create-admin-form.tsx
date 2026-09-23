"use client"

import { useActionState, useEffect } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createAdmin,
  type CreateAdminState,
} from "@/app/admin/(dashboard)/admins/actions"
import { createAdminSchema } from "@/app/admin/(dashboard)/admins/schema"
import { PasswordInput } from "@/components/admin/password-input"
import { useToastOnActionState } from "@/components/admin/use-toast-on-action-state"
import { useFormValid } from "@/hooks/use-form-valid"

const initialState: CreateAdminState = { status: "idle" }

export function CreateAdminForm() {
  const [state, formAction, pending] = useActionState(createAdmin, initialState)
  useToastOnActionState(state.status, state.message)
  const { formRef, valid, onChange, reset } = useFormValid(createAdminSchema)

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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" />
          {state.fieldErrors?.name ? (
            <p className="text-[0.7rem] text-destructive">
              {state.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" />
          {state.fieldErrors?.email ? (
            <p className="text-[0.7rem] text-destructive">
              {state.fieldErrors.email}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Initial password</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
          />
          {state.fieldErrors?.password ? (
            <p className="text-[0.7rem] text-destructive">
              {state.fieldErrors.password}
            </p>
          ) : null}
        </div>
      </div>

      <Button
        type="submit"
        disabled={pending || !valid}
        className="h-11 self-start px-6 text-sm"
      >
        {pending ? <Loader2 className="animate-spin" /> : null}
        Add admin
      </Button>
    </form>
  )
}
