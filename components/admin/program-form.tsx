"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Loader2, Languages, Plus, Trash2, TriangleAlert } from "lucide-react"

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
  saveProgram,
  type ProgramFormState,
} from "@/app/admin/(dashboard)/programs/actions"

const initialState: ProgramFormState = { status: "idle" }

const iconNames = Object.keys(iconMap)

type LangKey = "en" | "fr"

export type ProgramFormDefaults = {
  id: number
  icon: string
  position: number
  isPublished: boolean
  nameEn: string
  nameFr: string
  ageRangeEn: string
  ageRangeFr: string
  descriptionEn: string
  descriptionFr: string
  overviewEn: string
  overviewFr: string
  highlightsEn: string[]
  highlightsFr: string[]
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

export function ProgramForm({
  defaultProgram,
  defaultPosition = 0,
}: {
  defaultProgram?: ProgramFormDefaults
  defaultPosition?: number
}) {
  const [state, formAction, pending] = useActionState(saveProgram, initialState)
  useToastOnActionState(state.status, state.message)

  const name = useTranslatedPair(
    defaultProgram?.nameEn ?? "",
    defaultProgram?.nameFr ?? ""
  )
  const ageRange = useTranslatedPair(
    defaultProgram?.ageRangeEn ?? "",
    defaultProgram?.ageRangeFr ?? ""
  )
  const description = useTranslatedPair(
    defaultProgram?.descriptionEn ?? "",
    defaultProgram?.descriptionFr ?? ""
  )
  const overview = useTranslatedPair(
    defaultProgram?.overviewEn ?? "",
    defaultProgram?.overviewFr ?? ""
  )

  const [highlights, setHighlights] = useState(() => {
    const en = defaultProgram?.highlightsEn ?? []
    const fr = defaultProgram?.highlightsFr ?? []
    const length = Math.max(en.length, fr.length, 1)
    return Array.from({ length }, (_, index) => ({
      en: en[index] ?? "",
      fr: fr[index] ?? "",
    }))
  })

  const [isPublished, setIsPublished] = useState(
    defaultProgram?.isPublished ?? true
  )

  const needsTranslationReview =
    (defaultProgram?.needsTranslationReview ?? false) ||
    name.fallback ||
    ageRange.fallback ||
    description.fallback ||
    overview.fallback

  function updateHighlight(index: number, lang: LangKey, value: string) {
    setHighlights((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [lang]: value } : row))
    )
  }

  function addHighlight() {
    setHighlights((rows) => [...rows, { en: "", fr: "" }])
  }

  function removeHighlight(index: number) {
    setHighlights((rows) => rows.filter((_, i) => i !== index))
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {defaultProgram && (
        <input type="hidden" name="id" value={defaultProgram.id} />
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TranslatedField
          label="Name"
          idPrefix="name"
          nameEn="nameEn"
          nameFr="nameFr"
          pair={name}
          errorEn={state.fieldErrors?.nameEn}
          errorFr={state.fieldErrors?.nameFr}
        />
        <TranslatedField
          label="Age range"
          idPrefix="ageRange"
          nameEn="ageRangeEn"
          nameFr="ageRangeFr"
          pair={ageRange}
          errorEn={state.fieldErrors?.ageRangeEn}
          errorFr={state.fieldErrors?.ageRangeFr}
        />
      </div>

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

      <TranslatedField
        label="Overview"
        idPrefix="overview"
        nameEn="overviewEn"
        nameFr="overviewFr"
        pair={overview}
        errorEn={state.fieldErrors?.overviewEn}
        errorFr={state.fieldErrors?.overviewFr}
        multiline
        rows={8}
      />

      <div className="flex flex-col gap-3">
        <Label>Highlights</Label>
        {highlights.map((row, index) => (
          <div key={index} className="flex gap-2">
            <Input
              name="highlightsEn"
              placeholder="Highlight (English)"
              value={row.en}
              onChange={(event) =>
                updateHighlight(index, "en", event.target.value)
              }
            />
            <Input
              name="highlightsFr"
              placeholder="Highlight (French)"
              value={row.fr}
              onChange={(event) =>
                updateHighlight(index, "fr", event.target.value)
              }
            />
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              onClick={() => removeHighlight(index)}
              aria-label="Remove highlight"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={addHighlight}
          className="self-start"
        >
          <Plus className="size-3.5" />
          Add highlight
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field label="Icon" htmlFor="icon" error={state.fieldErrors?.icon}>
          <Select name="icon" defaultValue={defaultProgram?.icon}>
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
            defaultValue={defaultProgram?.position ?? defaultPosition}
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
        Save program
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
    <div className="flex flex-col gap-5 sm:flex-row sm:[&>*]:flex-1">
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
