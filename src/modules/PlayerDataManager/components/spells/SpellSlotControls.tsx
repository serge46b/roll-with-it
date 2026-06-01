"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import twclsx from "@/shared/utils/twClassMerge"
import { updateSpellUsedSlots } from "../../api/updaters"

interface SpellSlotControlsProps {
  slotId: number
  maxSlots: number
  usedSlots: number
}

export function SpellSlotControls({ slotId, maxSlots, usedSlots }: SpellSlotControlsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const remaining = maxSlots - usedSlots

  const changeUsed = (delta: number) => {
    startTransition(async () => {
      await updateSpellUsedSlots(slotId, usedSlots + delta, maxSlots)
      router.refresh()
    })
  }

  return (
    <div className={twclsx("flex items-center gap-[0.35em]", isPending && "animate-pulse")}>
      <span
        className={twclsx(
          "rounded-full border px-[0.45em] py-[0.1em] text-[0.8em] font-normal tabular-nums",
          remaining > 0 ? "border-white/35 bg-white/10 text-white/90" : "border-white/20 text-white/45",
        )}
        title="Остаток слотов"
      >
        {remaining}
      </span>
      <button
        type="button"
        disabled={isPending || usedSlots <= 0}
        onClick={(event) => {
          event.stopPropagation()
          changeUsed(-1)
        }}
        className="flex h-[1.5em] w-[1.5em] cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/40 text-white disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Вернуть слот"
      >
        −
      </button>
      <button
        type="button"
        disabled={isPending || usedSlots >= maxSlots}
        onClick={(event) => {
          event.stopPropagation()
          changeUsed(1)
        }}
        className="flex h-[1.5em] w-[1.5em] cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/40 text-white disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Потратить слот"
      >
        +
      </button>
    </div>
  )
}
