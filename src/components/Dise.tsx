"use client"

import Image from "next/image"
import { useState } from "react"

const DICE_SIDES = [4, 6, 8, 10, 12, 20] as const

export function rollDice(sides: number): number {
  const value = Math.floor(Math.random() * sides) + 1
  console.log(`d${sides}: ${value}`)
  return value
}

export function Dise() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`z-20 flex w-12 shrink-0 bg-black/70 transition-all duration-300 ${isOpen ? "flex-col items-center justify-start overflow-hidden" : "items-center justify-center"}`}
      style={{
        height: isOpen ? "min(26rem, calc(100vh - 3.5rem))" : "3rem",
        borderTopRightRadius: "0.625rem",
        borderTopLeftRadius: "0.625rem",
      }}
    >
      {isOpen ? (
        <>
          <button
            type="button"
            className="mt-3 flex w-full cursor-pointer justify-center"
            onClick={() => setIsOpen(false)}
            aria-label="Свернуть"
          >
            <Image
              src="/vercel.svg"
              alt="Close"
              width={21}
              height={21}
              className="rotate-180 rounded-[10%]"
            />
          </button>
          <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-y-auto pt-3 pb-2">
            <FunDise />
          </div>
        </>
      ) : (
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => setIsOpen(true)}
          aria-label="Открыть"
        >
          <Image
            src="/svgs/d20.svg"
            alt="Dise"
            width={24}
            height={24}
            className="rotate-180 rounded-[10%]"
          />
        </button>
      )}
    </div>
  )
}

export function FunDise() {
  const [maxSides, setMaxSides] = useState("")

  const rollFromInput = () => {
    const sides = Number(maxSides)
    if (!maxSides || sides < 1) return
    rollDice(sides)
  }

  return (
    <div className="flex w-full flex-col items-center gap-[0.75rem]">
      {DICE_SIDES.map((sides) => (
        <button
          key={sides}
          type="button"
          className="cursor-pointer"
          onClick={() => rollDice(sides)}
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
