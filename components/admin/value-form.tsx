"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Loader2, Languages, TriangleAlert } from "lucide-react"

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
import { iconMap } from "@/components/icon-map"
import { translateField } from "@/lib/translate-action"
import { useToastOnActionState } from "@/components/admin/use-toast-on-action-state"
import {
  saveValue,
  type ValueFormState,
} from "@/app/admin/(dashboard)/values/actions"

const initialState: ValueFormState = { status: "idle" }

const iconNames = Object.keys(iconMap)

type LangKey = "en" | "fr"

export type ValueFormDefaults = {
  id: number
  icon: string
  position: number
  isPublished: boolean
  titleEn: string
  titleFr: string
  descriptionEn: string
  descriptionFr: string
  needsTranslationReview: boolean
}

function useTranslatedPair(initialEn: string, initialFr: string) {
  const [en, setEn] = useState(initialEn)
  const [fr, setFr] = useState(initialFr)
  const [translating, setTranslating] = useState<LangKey | null>(null)
  const [fallback, setFallback] = useState(false)

  async function translate(source: LangKey) {
    const text = source === "en" ? en : fr
    if (!text.trim()) return
    setTranslating(source)
    try {
      const result = await translateField(
        text,
        source,
        source === "en" ? "fr" : "en"
      )
      if (source === "en") setFr(result.text)
      else setEn(result.text)
      if (result.usedFallback) setFallback(true)
    } finally {
      setTranslating(null)
    }
  }

  function handleBlur(source: LangKey) {
    const targetIsEmpty = source === "en" ? !fr.trim() : !en.trim()
    if (targetIsEmpty) translate(source)
  }

  return { en, setEn, fr, setFr, translating, fallback, translate, handleBlur }
}

export function ValueForm({
  defaultValue,
  defaultPosition = 0,
}: {
  defaultValue?: ValueFormDefaults
  defaultPosition?: number
}) {
  const [state, formAction, pending] = useActionState(saveValue, initialState)
  useToastOnActionState(state.status, state.message)

  const title = useTranslatedPair(
    defaultValue?.titleEn ?? "",
    defaultValue?.titleFr ?? ""
  )
  const description = useTranslatedPair(
    defaultValue?.descriptionEn ?? "",
    defaultValue?.descriptionFr ?? ""
  )

  const [isPublished, setIsPublished] = useState(
    defaultValue?.isPublished ?? true
  )

  const needsTranslationReview =
    (defaultValue?.needsTranslationReview ?? false) ||
    title.fallback ||
    description.fallback

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {defaultValue && (
        <input type="hidden" name="id" value={defaultValue.id} />
      )}
      <input
        type="hidden"
        name="needsTranslationReview"
        value={needsTranslationReview ? "true" : "false"}
      />

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"
        >
          {state.message}
        </p>
      )}

      {needsTranslationReview && (
        <p className="flex items-center gap-2 border border-gold/40 bg-gold/10 px-4 py-3 text-xs text-foreground">
          <TriangleAlert className="size-4 shrink-0 text-gold" />
          Automatic translation was unavailable for at least one field. Please
          review the French and English text below.
        </p>
      )}

      <TranslatedField
        label="Title"
        idPrefix="title"
        nameEn="titleEn"
        nameFr="titleFr"
        pair={title}
        errorEn={state.fieldErrors?.titleEn}
        errorFr={state.fieldErrors?.titleFr}
      />

      <TranslatedField
        label="Description"
        idPrefix="description"
        nameEn="descriptionEn"
        nameFr="descriptionFr"
        pair={description}
        errorEn={state.fieldErrors?.descriptionEn}
        errorFr={state.fieldErrors?.descriptionFr}
        multiline
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field label="Icon" htmlFor="icon" error={state.fieldErrors?.icon}>
          <Select name="icon" defaultValue={defaultValue?.icon}>
            <SelectTrigger id="icon" className="w-full">
              <SelectValue placeholder="Choose an icon" />
            </SelectTrigger>
            <SelectContent>
              {iconNames.map((iconName) => {
                const Icon = iconMap[iconName]
                return (
                  <SelectItem key={iconName} value={iconName}>
                    <Icon className="size-4" />
                    {iconName}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Position" htmlFor="position">
          <Input
            id="position"
            name="position"
            type="number"
            defaultValue={defaultValue?.position ?? defaultPosition}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="isPublished">Published</Label>
          <div className="flex h-10 items-center">
            <input
              id="isPublished"
              type="checkbox"
              checked={isPublished}
              onChange={(event) => setIsPublished(event.target.checked)}
              className="size-4 accent-primary"
            />
            <input
              type="hidden"
              name="isPublished"
              value={isPublished ? "true" : "false"}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-11 self-start px-6 text-sm"
      >
        {pending ? <Loader2 className="animate-spin" /> : null}
        Save value
      </Button>
    </form>
  )
}

function TranslatedField({
  label,
  idPrefix,
  nameEn,
  nameFr,
  pair,
  errorEn,
  errorFr,
  multiline,
  rows = 4,
}: {
  label: string
  idPrefix: string
  nameEn: string
  nameFr: string
  pair: ReturnType<typeof useTranslatedPair>
  errorEn?: string
  errorFr?: string
  multiline?: boolean
  rows?: number
}) {
  const FieldControl = multiline ? Textarea : Input
  const controlProps = multiline ? { rows } : {}

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:*:flex-1">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}En`}>{label} (English)</Label>
        <FieldControl
          id={`${idPrefix}En`}
          name={nameEn}
          value={pair.en}
          onChange={(event) => pair.setEn(event.target.value)}
          onBlur={() => pair.handleBlur("en")}
          {...controlProps}
        />
        {errorEn ? (
          <p className="text-[0.7rem] text-destructive">{errorEn}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor={`${idPrefix}Fr`}>{label} (French)</Label>
          <button
            type="button"
            onClick={() => pair.translate("en")}
            className="flex items-center gap-1 text-[0.65rem] text-muted-foreground hover:text-foreground"
            aria-label={`Retranslate ${label} from English`}
          >
            {pair.translating ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Languages className="size-3" />
            )}
            Retranslate
          </button>
        </div>
        <FieldControl
          id={`${idPrefix}Fr`}
          name={nameFr}
          value={pair.fr}
          onChange={(event) => pair.setFr(event.target.value)}
          onBlur={() => pair.handleBlur("fr")}
          {...controlProps}
        />
        {errorFr ? (
          <p className="text-[0.7rem] text-destructive">{errorFr}</p>
        ) : null}
      </div>
    </div>
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
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-[0.7rem] text-destructive">{error}</p> : null}
    </div>
  )
}
