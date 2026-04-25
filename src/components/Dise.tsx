"use client"

import Image from "next/image"
import { useState } from "react"

//Дайсы и для Player и Master
const DICE_SIDES = [4, 6, 8, 10, 12, 20] as const;

export function rollDice(sides: number): number {
  const value = Math.floor(Math.random() * sides) + 1;
  console.log(`d${sides}: ${value}`);
  return value;
}

export function FunDise() {
  const [maxSides, setMaxSides] = useState("");

  const rollFromInput = () => {
      const sides = Number(maxSides);
      if (!maxSides || sides < 1) return;
      rollDice(sides);
  };

  return (
      <div className="w-full h-full flex flex-col items-center gap-[1rem]">
          {DICE_SIDES.map((sides) => (
              <button
                  key={sides}
                  type="button"
                  className="cursor-pointer"
                  onClick={() => {
                      setMaxSides(String(sides));
                      rollDice(sides);
                  }}
                  aria-label={`Бросить d${sides}`}
              >
                  <Image src={`/svgs/dice${sides}.svg`} alt={`d${sides}`} width={32} height={32} />
              </button>
          ))}
          <input
              type="text"
              inputMode="numeric"
              className="w-[32px] h-[32px] bg-white/50 rounded-[30%] text-black text-center text-sm leading-[32px]"
              value={maxSides}
              onChange={(e) => setMaxSides(e.target.value.replace(/\D/g, ""))}
          />
          <button type="button" className="cursor-pointer" onClick={rollFromInput}>
              <Image src="/svgs/check.svg" alt="Check" width={32} height={32} />
          </button>
      </div>
  );
}
