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
import {
  submitInquiry,
  type InquiryState,
} from "@/app/(marketing)/admissions/actions"
import type { Dictionary } from "@/lib/i18n/get-dictionary"
import { admissionsTermOptions } from "@/lib/admissions-terms"
import { cn } from "@/lib/utils"

const initialState: InquiryState = { status: "idle" }

export function AdmissionInquiryForm({
  dict,
  programs,
  defaultProgram,
}: {
  dict: Dictionary
  programs: { slug: string; name: string }[]
  defaultProgram?: string
}) {
  const f = dict.admissions.form
  const [state, formAction, pending] = useActionState(
    submitInquiry,
    initialState
  )
  const formRef = useRef<HTMLFormElement>(null)
  const validDefaultProgramSlug = programs.find(
    (program) => program.slug === defaultProgram
  )?.slug

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
          {f.receivedTitle}
        </h3>
        <p className="max-w-sm text-sm/relaxed text-muted-foreground">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      action={formAction}
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label={f.parentName}
          htmlFor="parentName"
          error={state.fieldErrors?.parentName}
        >
          <Input
            id="parentName"
            name="parentName"
            autoComplete="name"
            placeholder={f.parentNamePlaceholder}
            required
            aria-required="true"
            aria-invalid={!!state.fieldErrors?.parentName}
            aria-describedby={
              state.fieldErrors?.parentName ? "parentName-error" : undefined
            }
          />
        </Field>
        <Field
          label={f.childName}
          htmlFor="childName"
          error={state.fieldErrors?.childName}
        >
          <Input
            id="childName"
            name="childName"
            placeholder={f.childNamePlaceholder}
            required
            aria-required="true"
            aria-invalid={!!state.fieldErrors?.childName}
            aria-describedby={
              state.fieldErrors?.childName ? "childName-error" : undefined
            }
          />
        </Field>
        <Field label={f.email} htmlFor="email" error={state.fieldErrors?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={f.emailPlaceholder}
            required
            aria-required="true"
            aria-invalid={!!state.fieldErrors?.email}
            aria-describedby={
              state.fieldErrors?.email ? "email-error" : undefined
            }
          />
        </Field>
        <Field label={f.phone} htmlFor="phone" error={state.fieldErrors?.phone}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={f.phonePlaceholder}
            required
            aria-required="true"
            aria-invalid={!!state.fieldErrors?.phone}
            aria-describedby={
              state.fieldErrors?.phone ? "phone-error" : undefined
            }
          />
        </Field>
        <Field
          label={f.program}
          htmlFor="program"
          error={state.fieldErrors?.program}
        >
          <Select name="program" defaultValue={validDefaultProgramSlug}>
            <SelectTrigger id="program" className="w-full">
              <SelectValue placeholder={f.programPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {programs.map((program) => (
                <SelectItem key={program.slug} value={program.slug}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label={f.preferredTerm} htmlFor="preferredTerm">
          <Select name="preferredTerm">
            <SelectTrigger id="preferredTerm" className="w-full">
              <SelectValue placeholder={f.preferredTermPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {admissionsTermOptions(dict.locale).map(({ key, label }) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label={f.message} htmlFor="message">
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder={f.messagePlaceholder}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-11 self-start px-6 text-sm"
      >
        {pending ? (
          <>
            <Loader2 data-icon="inline-start" className="animate-spin" />
            {f.sending}
          </>
        ) : (
          <>
            {f.submit}
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
        <p
          id={`${htmlFor}-error`}
          className={cn("text-[0.7rem] text-destructive")}
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
