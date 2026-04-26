"use client"

import Image from "next/image"
import { useState } from "react"
import { BlocksPole } from "@/components/FunBlocks"

//=============================================================================================================
// Маленький интерфейс здоровья для существ
function SmallInterfaceHp({ name, maxHP, currentHP, borderColor }: { name: string, maxHP: number, currentHP: number, borderColor: string }) {
  const [hp, setHp] = useState(currentHP);
  const [hpChange, setHpChange] = useState(1);
  const hpWidth = `${(hp / maxHP) * 100}%`;
  const whiteHpSkew = "1rem";
  const redHpSkew = "0.8rem";
  const changeHp = (   direction: 1 | -1) => {
      setHp((prevHp) => Math.min(maxHP, Math.max(0, prevHp + hpChange * direction)));
  };
  const handleHpChangeInput = (value: string) => {
      if (!/^\d*$/.test(value)) return;

      setHpChange(value === "" ? 0 : Number(value));
  };

  return (
      <div className="flex flex-col relative gap-3 bg-black/70 fixed top-52 h-[100px] w-[450px] px-3">
      <img src="/top100/4.jpeg" alt="User" className="absolute left-2 top-5 h-[60px] w-[60px] rounded-full border-2 object-cover" style={{ borderColor }} />
          <div className="flex flex-row items-center gap-2">
              <p className="w-[9rem] text-white text-1xl font-exo2 absolute left-19 top-4.5">{name}</p>
              <button className="cursor-pointer bg-green-500 rounded-[30%] p-1 absolute left-54 top-4.5" 
              onClick={() => changeHp(1)}>
                  <Image src="/Plus.svg" alt="Plus" width={20} height={20} />
              </button>
              <input type="text" inputMode="numeric" value={hpChange} 
              onChange={(event) => handleHpChangeInput(event.target.value)} className="w-10 h-10 bg-white/70 rounded-[30%] text-black text-center items-center justify-center absolute left-63 top-3" />
              <button className="cursor-pointer bg-red-500 rounded-[30%] p-1 absolute left-75 top-4.5" 
              onClick={() => changeHp(-1)}>
                  <Image src="/Minus.svg" alt="Minus" width={20} height={20} />
              </button>
          </div>
          <div className="flex flex-row absolute left-14 top-16">
              <p className="w-[4.5rem] text-center text-white text-1xl font-exo2 absolute left-0">{maxHP}/{hp}</p>
              <div className="relative h-[1.5rem] w-[300px] absolute left-19">
                  <div
                      className="absolute inset-0 bg-white"
                      style={{
                          clipPath: `polygon(0 0, calc(100% - ${whiteHpSkew}) 0, 100% 100%, ${whiteHpSkew} 100%)`,
                      }}
                  />
                  <div className="absolute left-[0.35rem] top-[0.15rem] h-[1.2rem] w-[calc(100%-0.7rem)]">
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
  );
}

