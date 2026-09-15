"use client"

import { useActionState, useEffect, useRef } from "react"
import { CheckCircle2, Loader2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { submitInquiry, type InquiryState } from "@/app/admissions/actions"
import { programs } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const initialState: InquiryState = { status: "idle" }

export function AdmissionInquiryForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset()
    }
  }, [state.status])

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 border border-border bg-card px-6 py-14 text-center">
        <CheckCircle2 className="size-12 text-teal" />
        <h3 className="font-heading text-xl font-semibold text-foreground">
          Inquiry received
        </h3>
        <p className="max-w-sm text-sm/relaxed text-muted-foreground">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-5">
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"
        >
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Parent / Guardian Name" htmlFor="parentName" error={state.fieldErrors?.parentName}>
          <Input id="parentName" name="parentName" autoComplete="name" placeholder="e.g. Jean Mukamana" />
        </Field>
        <Field label="Student's Name" htmlFor="childName" error={state.fieldErrors?.childName}>
          <Input id="childName" name="childName" placeholder="e.g. Aline Mukamana" />
        </Field>
        <Field label="Email Address" htmlFor="email" error={state.fieldErrors?.email}>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        </Field>
        <Field label="Phone Number" htmlFor="phone" error={state.fieldErrors?.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+250 7xx xxx xxx" />
        </Field>
        <Field label="Program of Interest" htmlFor="program" error={state.fieldErrors?.program}>
          <Select name="program">
            <SelectTrigger id="program" className="w-full">
              <SelectValue placeholder="Select a program" />
            </SelectTrigger>
            <SelectContent>
              {programs.map((program) => (
                <SelectItem key={program.slug} value={program.name}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Preferred Start Term" htmlFor="preferredTerm">
          <Select name="preferredTerm">
            <SelectTrigger id="preferredTerm" className="w-full">
              <SelectValue placeholder="Select a term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Term 1">Term 1</SelectItem>
              <SelectItem value="Term 2">Term 2</SelectItem>
              <SelectItem value="Term 3">Term 3</SelectItem>
              <SelectItem value="Not sure yet">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Message (optional)" htmlFor="message">
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us anything that would help our admissions team — current grade, special needs support required, etc."
        />
      </Field>

      <Button type="submit" size="lg" disabled={pending} className="h-11 self-start px-6 text-sm">
        {pending ? (
          <>
            <Loader2 data-icon="inline-start" className="animate-spin" />
            Sending&hellip;
          </>
        ) : (
          <>
            Submit Inquiry
            <Send data-icon="inline-end" />
          </>
        )}
      </Button>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p className={cn("text-[0.7rem] text-destructive")}>{error}</p>
      ) : null}
    </div>
  )
}
