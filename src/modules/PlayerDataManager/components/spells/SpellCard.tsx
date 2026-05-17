"use client"

import { useState } from "react"
import { Tooltip } from "@base-ui/react/tooltip"
import PrestyledTooltip from "@/components/PrestyledTooltip"
import twclsx from "@/shared/utils/twClassMerge"
import {
  CARD_BODY_PADDING,
  CARD_DESC_TEXT,
  CARD_HEADER_PADDING,
  CARD_PILL_CLASS,
  CARD_PILL_TEXT_CLASS,
  CARD_ROW_GAP,
  CARD_ROW_TEXT,
  CARD_SURFACE,
  CARD_SURFACE_GROUPED,
} from "../cardStyles"
import type { SpellCardData } from "../../types/PlayerDataTypes"
import { getSpellLevelLabel } from "../../types/PlayerDataTypes"
import { usePlayerDataModal } from "../PlayerDataModalContext"
import { useTransition } from "react"

interface SpellCardProps {
  data: SpellCardData
  className?: string
  defaultExpanded?: boolean
  showLevel?: boolean
  grouped?: boolean
}

function SpellPill({ label, value }: { label: string; value: string }) {
  return (
    <PrestyledTooltip label={label}>
      <Tooltip.Trigger delay={150} className={CARD_PILL_CLASS}>
        <span className={CARD_PILL_TEXT_CLASS}>{value}</span>
      </Tooltip.Trigger>
    </PrestyledTooltip>
  )
}

export function SpellCard({ data, className, defaultExpanded = false, showLevel = true, grouped = false }: SpellCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const { openModal } = usePlayerDataModal()
  const [isEditPending, startEditTransition] = useTransition()

  return (
    <article
      className={twclsx(
        "relative w-full rounded-[0.45em] border text-[length:1em] text-white",
        grouped ? CARD_SURFACE_GROUPED : CARD_SURFACE,
        className,
      )}
    >
      <button
        type="button"
        className={twclsx(
          "absolute top-[0.4em] right-[0.4em] z-10 rounded-md bg-white/50 px-2 py-1 text-[0.7em] text-black",
          isEditPending && "animate-pulse",
        )}
        onClick={() => {
          startEditTransition(async () => {
            await openModal({ kind: "spell", id: data.id })
          })
        }}
      >
        Edit
      </button>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            setExpanded((prev) => !prev)
          }
        }}
        className={twclsx("w-full cursor-pointer text-left outline-none focus:outline-none", CARD_HEADER_PADDING)}
      >
        <div className={twclsx("flex w-full min-w-0 items-center pr-[3em]", CARD_ROW_GAP, CARD_ROW_TEXT)}>
          <PrestyledTooltip label="Название">
            <Tooltip.Trigger delay={150} className="min-w-0 flex-1 truncate text-left font-medium">
              {data.name}
            </Tooltip.Trigger>
          </PrestyledTooltip>

          {showLevel ? <SpellPill label="Уровень" value={getSpellLevelLabel(data.level)} /> : null}
        </div>
      </div>

      {expanded ? (
        <div className={twclsx("border-t border-white/15", CARD_BODY_PADDING, CARD_DESC_TEXT)}>{data.description}</div>
      ) : null}
    </article>
  )
}
