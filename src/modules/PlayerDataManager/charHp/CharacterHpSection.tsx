"use client"

import { HpBar } from "@/components/HpBar"
import { HpControls } from "@/components/HpControls"
import { useCharacterHp } from "./useCharacterHp"

interface CharacterHpSectionProps {
  characterId: number
  currentHp: number
  maxHp: number
  canEditHp: boolean
  className?: string
}

export function CharacterHpSection({
  characterId,
  currentHp,
  maxHp,
  canEditHp,
  className,
}: CharacterHpSectionProps) {
  const { hp, handleHpChange, isPending } = useCharacterHp({ characterId, currentHp, maxHp, canEditHp })

  return (
    <div className={className}>
      {canEditHp ? (
        <div className={`mb-[0.35em] flex justify-end ${isPending ? "animate-pulse" : ""}`}>
          <HpControls value={hp} onChange={handleHpChange} disabled={isPending} />
        </div>
      ) : null}
      <div className="flex items-center gap-[0.5em]">
        <p className="w-[4.5em] shrink-0 text-center text-[0.85em]">
          {hp}/{maxHp}
        </p>
        <HpBar maxHp={maxHp} currentHp={hp} className="flex-1" />
      </div>
    </div>
  )
}
