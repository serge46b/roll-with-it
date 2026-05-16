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
  CARD_WEAPON_STATS_GAP,
} from "../cardStyles"
import type { WeaponCardData } from "../../types/PlayerDataTypes"
import { usePlayerDataModal } from "../PlayerDataModalContext"
import { useTransition } from "react"

interface WeaponCardProps {
  data: WeaponCardData
  className?: string
  defaultExpanded?: boolean
}

function WeaponPill({ label, value }: { label: string; value: string }) {
  return (
    <PrestyledTooltip label={label}>
      <Tooltip.Trigger delay={150} className={CARD_PILL_CLASS}>
        <span className={CARD_PILL_TEXT_CLASS}>{value}</span>
      </Tooltip.Trigger>
    </PrestyledTooltip>
  )
}

export function WeaponCard({ data, className, defaultExpanded = false }: WeaponCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const { openModal } = usePlayerDataModal()
  const [isEditPending, startEditTransition] = useTransition()

  return (
    <article className={twclsx("relative w-full rounded-[0.45em] border text-[length:1em] text-white", CARD_SURFACE, className)}>
      <button
        type="button"
        className={twclsx(
          "absolute top-[0.4em] right-[0.4em] z-10 rounded-md bg-white/50 px-2 py-1 text-[0.7em] text-black",
          isEditPending && "animate-pulse",
        )}
        onClick={() => {
          startEditTransition(async () => {
            await openModal({ kind: "weapon", equipmentItemId: data.equipmentItemId })
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

          <div className={twclsx("flex shrink-0 flex-wrap items-center justify-start", CARD_WEAPON_STATS_GAP)}>
            <WeaponPill label="Бонус атаки" value={data.attackBonus} />
            <WeaponPill label="Урон" value={data.damage} />
            <WeaponPill label="Вид" value={data.type} />
          </div>
        </div>
      </div>

      {expanded ? (
        <p className={twclsx("border-t border-white/15", CARD_BODY_PADDING, CARD_DESC_TEXT)}>{data.description}</p>
      ) : null}
    </article>
  )
}

export function WeaponListHeader({ className }: { className?: string }) {
  return (
    <div
      className={twclsx(
        "flex w-full items-center rounded-[0.45em] bg-black/55 px-[0.75em] py-[0.5em] text-[length:1em] text-[0.75em] uppercase tracking-wider text-white/60",
        CARD_ROW_GAP,
        className,
      )}
    >
      <span className="min-w-0 flex-1">Имя</span>
      <div className={twclsx("flex shrink-0 items-center justify-start", CARD_WEAPON_STATS_GAP)}>
        <span>БА</span>
        <span>Урон</span>
        <span>Вид</span>
      </div>
    </div>
  )
}
