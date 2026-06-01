"use client"

import { Collapsible } from "@base-ui/react/collapsible"
import twclsx from "@/shared/utils/twClassMerge"
import { LEVEL_TRIGGER_CLASS } from "../cardStyles"
import { SpellCard } from "./SpellCard"
import { SpellSlotControls } from "./SpellSlotControls"
import { SPELL_LEVELS, getSpellLevelLabel, type SlotsByLevel, type SpellsByLevel } from "../../types/PlayerDataTypes"

interface SpellLevelListProps {
  spellsByLevel: SpellsByLevel
  slotsByLevel: SlotsByLevel
  className?: string
}

export function SpellLevelList({ spellsByLevel, slotsByLevel, className }: SpellLevelListProps) {
  return (
    <div className={twclsx("flex w-full flex-col gap-[0.55em] text-[length:1em] text-white", className)}>
      {SPELL_LEVELS.map((level) => {
        const levelSpells = spellsByLevel[level]
        const slot = slotsByLevel[level]
        const hasContent = levelSpells.length > 0 || slot !== null

        if (!hasContent) return null

        return (
            <Collapsible.Root key={level} className="flex flex-col gap-[0.35em]">
              <div className={LEVEL_TRIGGER_CLASS}>
                <Collapsible.Trigger className="min-w-0 flex-1 cursor-pointer text-left outline-none">
                  {getSpellLevelLabel(level)}
                </Collapsible.Trigger>
                {slot ? (
                  <SpellSlotControls slotId={slot.id} maxSlots={slot.maxSlots} usedSlots={slot.usedSlots} />
                ) : (
                  <span className="text-[0.8em] font-normal text-white/45">0</span>
                )}
              </div>

            <Collapsible.Panel className="ml-[0.4em] flex flex-col gap-[0.45em] border-l-2 border-white/25 pl-[0.65em] pt-[0.15em]">
              {levelSpells.length > 0 ? (
                levelSpells.map((spell) => <SpellCard key={spell.id} data={spell} showLevel={false} grouped />)
              ) : (
                <p className="py-[0.35em] text-[0.8em] text-white/45">Нет заклинаний</p>
              )}
            </Collapsible.Panel>
          </Collapsible.Root>
        )
      })}
    </div>
  )
}
