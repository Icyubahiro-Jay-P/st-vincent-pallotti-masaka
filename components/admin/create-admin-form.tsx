"use client"

import { useActionState, useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createAdmin,
  type CreateAdminState,
} from "@/app/admin/(dashboard)/admins/actions"
import { useToastOnActionState } from "@/components/admin/use-toast-on-action-state"

const initialState: CreateAdminState = { status: "idle" }

export function CreateAdminForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState(createAdmin, initialState)
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
          <Input
            id="password"
            name="password"
            type="password"
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
        disabled={pending}
        className="h-11 self-start px-6 text-sm"
      >
        {pending ? <Loader2 className="animate-spin" /> : null}
        Add admin
      </Button>
    </form>
  )
}
