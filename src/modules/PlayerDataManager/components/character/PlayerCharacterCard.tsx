"use client"

import Image from "next/image"
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
import { CharacterHpSection } from "../../charHp/CharacterHpSection"
import type { PlayerCharacterCardData } from "../../types/PlayerDataTypes"
import { formatCharacteristicValue } from "../../types/PlayerDataTypes"

interface PlayerCharacterCardProps {
  data: PlayerCharacterCardData
  className?: string
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <PrestyledTooltip label={label}>
      <Tooltip.Trigger delay={150} className={CARD_PILL_CLASS}>
        <span className={CARD_PILL_TEXT_CLASS}>{value}</span>
      </Tooltip.Trigger>
    </PrestyledTooltip>
  )
}

export function PlayerCharacterCard({ data, className }: PlayerCharacterCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article
      className={twclsx(
        "relative w-full rounded-[0.5em] border border-white/20 text-[length:1em] text-white",
        CARD_SURFACE,
        className,
      )}
      style={{ backgroundColor: `${data.accentColor}33` }}
    >
      <div className={twclsx("flex gap-[0.75em]", CARD_HEADER_PADDING)}>
        {data.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt={data.name}
            width={56}
            height={56}
            className="h-[3.5em] w-[3.5em] shrink-0 rounded-full border-2 object-cover"
            style={{ borderColor: data.accentColor }}
            unoptimized
          />
        ) : (
          <div
            className="h-[3.5em] w-[3.5em] shrink-0 rounded-full border-2 bg-white/15"
            style={{ borderColor: data.accentColor }}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-[0.45em]">
          <div>
            <h3 className="truncate text-[1em] font-medium">{data.name}</h3>
            <p className="text-[0.8em] text-white/70">
              {data.class || "—"} · {data.race || "—"} · ур. {data.level}
            </p>
          </div>

          <CharacterHpSection
            characterId={data.id}
            currentHp={data.currentHp}
            maxHp={data.maxHp}
            canEditHp={data.canEditHp}
          />

          <div className={twclsx("flex flex-wrap items-center", CARD_WEAPON_STATS_GAP, CARD_ROW_TEXT)}>
            <StatPill label="Класс защиты" value={String(data.defenseClass)} />
            <StatPill label="Скорость" value={String(data.speed)} />
            <StatPill label="Бонус HP" value={data.hpBonus >= 0 ? `+${data.hpBonus}` : String(data.hpBonus)} />
            {data.alignment ? <StatPill label="Мировоззение" value={data.alignment} /> : null}
          </div>

          {data.characteristics.length > 0 ? (
            <div className={twclsx("flex flex-wrap items-center", CARD_WEAPON_STATS_GAP, CARD_ROW_TEXT)}>
              {data.characteristics.map((characteristic) => (
                <StatPill
                  key={characteristic.id}
                  label={characteristic.name}
                  value={formatCharacteristicValue(characteristic.value)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {data.backgroundStory ? (
        <>
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
            className={twclsx(
              "cursor-pointer border-t border-white/15 px-[0.75em] py-[0.55em] text-[0.75em] tracking-wide text-white/60 uppercase",
            )}
          >
            {expanded ? "Скрыть историю" : "История персонажа"}
          </div>
          {expanded ? (
            <p className={twclsx("border-t border-white/15", CARD_BODY_PADDING, CARD_DESC_TEXT, CARD_ROW_GAP)}>
              {data.backgroundStory}
            </p>
          ) : null}
        </>
      ) : null}
    </article>
  )
}
