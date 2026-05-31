"use client"

import Image from "next/image"
import { useTransition } from "react"
import { HpBar } from "@/components/HpBar"
import { HpControls } from "@/components/HpControls"
import type { NpcCardData } from "../../types/PlayerDataTypes"
import { usePlayerDataModal } from "../PlayerDataModalContext"
import { useCharacterHp } from "../../charHp/useCharacterHp"

interface NpcCardProps {
  data: NpcCardData
  className?: string
}

export function NpcCard({ data, className }: NpcCardProps) {
  const { openModal } = usePlayerDataModal()
  const [isEditPending, startEditTransition] = useTransition()
  const { hp, handleHpChange, isPending } = useCharacterHp({
    characterId: data.id,
    currentHp: data.currentHp,
    maxHp: data.maxHp,
    canEditHp: data.canEditHp,
  })

  return (
    <article
      className={`relative w-full rounded-[0.5em] border border-white/20 text-[length:1em] text-white ${className ?? ""}`}
      style={{ backgroundColor: `${data.accentColor}33` }}
    >
      {data.canEditHp ? (
        <button
          type="button"
          className={`absolute top-[0.4em] right-[0.4em] z-10 rounded-md bg-white/50 px-2 py-1 text-[0.7em] text-black ${isEditPending ? "animate-pulse" : ""}`}
          onClick={() => {
            startEditTransition(async () => {
              await openModal({ kind: "npc", id: data.id })
            })
          }}
        >
          Edit
        </button>
      ) : null}
      <div className="flex gap-[0.75em] p-[0.75em]">
        {data.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt={data.name}
            width={48}
            height={48}
            className="pointer-events-none h-[3em] w-[3em] shrink-0 rounded-full border-2 object-cover"
            style={{ borderColor: data.accentColor }}
            unoptimized
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        ) : (
          <div
            className="h-[3em] w-[3em] shrink-0 rounded-full border-2 bg-white/15"
            style={{ borderColor: data.accentColor }}
          />
        )}

        <div className={`flex min-w-0 flex-1 flex-col gap-[0.5em] ${data.canEditHp ? "pr-[3em]" : ""}`}>
          <div className={`flex min-w-0 items-center gap-[0.5em] ${isPending ? "animate-pulse" : ""}`}>
            <p className="min-w-0 flex-1 truncate text-[0.95em]">{data.name}</p>
            {data.canEditHp ? <HpControls value={hp} onChange={handleHpChange} disabled={isPending} /> : null}
          </div>

          <div className="flex items-center gap-[0.5em]">
            <p className="w-[4.5em] shrink-0 text-center text-[0.85em]">
              {hp}/{data.maxHp}
            </p>
            <HpBar maxHp={data.maxHp} currentHp={hp} className="flex-1" />
          </div>
        </div>
      </div>
    </article>
  )
}
