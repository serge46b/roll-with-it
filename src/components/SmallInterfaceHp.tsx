"use client"

import Image from "next/image"
import { useState } from "react"

export function SmallInterfaceHp({
  name,
  maxHP,
  currentHP,
  borderColor,
}: {
  name: string
  maxHP: number
  currentHP: number
  borderColor: string
}) {
  const [hp, setHp] = useState(currentHP)
  const [hpChange, setHpChange] = useState(1)
  const hpWidth = `${(hp / maxHP) * 100}%`
  const whiteHpSkew = "1rem"
  const redHpSkew = "0.8rem"
  const changeHp = (direction: 1 | -1) => {
    setHp((prevHp) => Math.min(maxHP, Math.max(0, prevHp + hpChange * direction)))
  }
  const handleHpChangeInput = (value: string) => {
    if (!/^\d*$/.test(value)) return

    setHpChange(value === "" ? 0 : Number(value))
  }

  return (
    <div className="fixed top-52 flex h-[100px] w-[450px] flex-col gap-3 bg-black/70 px-3">
      <img
        src="/top100/4.jpeg"
        alt="User"
        className="absolute top-5 left-2 h-[60px] w-[60px] rounded-full border-2 object-cover"
        style={{ borderColor }}
      />
      <div className="flex flex-row items-center gap-2">
        <p className="text-1xl absolute top-4.5 left-19 w-[9rem] font-exo2 text-white">{name}</p>
        <button
          className="absolute top-4.5 left-54 cursor-pointer rounded-[30%] bg-green-500 p-1"
          onClick={() => changeHp(1)}
        >
          <Image src="/Plus.svg" alt="Plus" width={20} height={20} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={hpChange}
          onChange={(event) => handleHpChangeInput(event.target.value)}
          className="absolute top-3 left-63 h-10 w-10 items-center justify-center rounded-[30%] bg-white/70 text-center text-black"
        />
        <button
          className="absolute top-4.5 left-75 cursor-pointer rounded-[30%] bg-red-500 p-1"
          onClick={() => changeHp(-1)}
        >
          <Image src="/Minus.svg" alt="Minus" width={20} height={20} />
        </button>
      </div>
      <div className="absolute top-16 left-14 flex flex-row">
        <p className="text-1xl absolute left-0 w-[4.5rem] text-center font-exo2 text-white">
          {maxHP}/{hp}
        </p>
        <div className="absolute left-19 relative h-[1.5rem] w-[300px]">
          <div
            className="absolute inset-0 bg-white"
            style={{
              clipPath: `polygon(0 0, calc(100% - ${whiteHpSkew}) 0, 100% 100%, ${whiteHpSkew} 100%)`,
            }}
          />
          <div className="absolute top-[0.15rem] left-[0.35rem] h-[1.2rem] w-[calc(100%-0.7rem)]">
            <div
              className="h-full bg-[#c92b2f]"
              style={{
                width: hpWidth,
                clipPath: `polygon(0 0, calc(100% - ${redHpSkew}) 0, 100% 100%, ${redHpSkew} 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
