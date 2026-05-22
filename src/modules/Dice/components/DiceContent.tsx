"use client"

import { RollDiceModalContext } from "@/modules/Dice/components/RollDiceModalContext"
import Image from "next/image"
import { useContext, useState } from "react"

const DICE_SIDES = [4, 6, 8, 10, 12, 20] as const

export function DiceContent() {
  const [maxSides, setMaxSides] = useState("")
  const { openModal, closeModal } = useContext(RollDiceModalContext)

  const rollFromInput = () => {
    const sides = Number(maxSides)
    if (!maxSides || sides < 1) return
    const value = Math.floor(Math.random() * sides) + 1
    console.log(`d${sides}: ${value}`)
    openModal(sides, value)
  }

  return (
    <div className="flex w-full flex-col items-center gap-[0.75rem]">
      {DICE_SIDES.map((sides) => (
        <button
          key={sides}
          type="button"
          className="cursor-pointer"
          onClick={() => {
            const value = Math.floor(Math.random() * sides) + 1
            console.log(`d${sides}: ${value}`)
            openModal(sides, value)
          }}
          aria-label={`Бросить d${sides}`}
        >
          <Image src={`/svgs/dice${sides}.svg`} alt={`d${sides}`} width={32} height={32} />
        </button>
      ))}
      <input
        type="text"
        inputMode="numeric"
        className="h-[32px] w-[32px] rounded-[30%] bg-white/50 text-center text-sm leading-[32px] text-black"
        value={maxSides}
        onChange={(e) => setMaxSides(e.target.value.replace(/\D/g, ""))}
      />
      <button type="button" className="cursor-pointer" onClick={rollFromInput}>
        <Image src="/svgs/check.svg" alt="Check" width={32} height={32} />
      </button>
    </div>
  )
}
