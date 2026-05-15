"use client"

import Image from "next/image"
import { useState } from "react"
import twclsx from "@/shared/utils/twClassMerge"

interface HpControlsProps {
  value: number
  step?: number
  onChange: (newValue: number) => void
  disabled?: boolean
}

export function HpControls({ value, step: stepProp, onChange, disabled = false }: HpControlsProps) {
  const [localStep, setLocalStep] = useState(stepProp ?? 1)
  const step = stepProp ?? localStep

  const handleInput = (raw: string) => {
    if (disabled || !/^\d*$/.test(raw)) return
    const next = raw === "" ? 0 : Number(raw)
    if (stepProp === undefined) setLocalStep(next)
  }

  const buttonClass = "flex h-[1.75em] w-[1.75em] items-center justify-center rounded-[30%] p-[0.15em] disabled:cursor-not-allowed disabled:opacity-40"

  return (
    <div className={twclsx("flex shrink-0 items-center gap-[0.35em]", disabled && "opacity-70")}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(value - step)}
        className={twclsx(buttonClass, "cursor-pointer bg-red-500")}
        aria-label="Уменьшить HP"
      >
        <Image src="/svgs/minus.svg" alt="" width={16} height={16} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={stepProp ?? localStep}
        onChange={(event) => handleInput(event.target.value)}
        readOnly={stepProp !== undefined || disabled}
        disabled={disabled}
        className="h-[1.75em] w-[1.75em] rounded-[30%] bg-white/70 text-center text-[0.75em] text-black outline-none disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Шаг изменения HP"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(value + step)}
        className={twclsx(buttonClass, "cursor-pointer bg-green-500 text-[1em] leading-none text-white")}
        aria-label="Увеличить HP"
      >
        +
      </button>
    </div>
  )
}
