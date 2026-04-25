"use client"

import Image from "next/image"
import { useState } from "react"
import {BlocksPole } from "@/components/FunBlocks"
import { ChatPole } from "@/components/Chat"

function InterfaceHp({ name, maxHP, currentHP }: { name: string, maxHP: number, currentHP: number }) {
  const [hp, setHp] = useState(currentHP);
  const [hpChange, setHpChange] = useState(1);
  const hpWidth = `${(hp / maxHP) * 100}%`;
  const whiteHpSkew = "1rem";
  const redHpSkew = "0.8rem";
  const changeHp = (direction: 1 | -1) => {
      setHp((prevHp) => Math.min(maxHP, Math.max(0, prevHp + hpChange * direction)));
  };
  const handleHpChangeInput = (value: string) => {
      if (!/^\d*$/.test(value)) return;

      setHpChange(value === "" ? 0 : Number(value));
  };
  return (
      <div className="flex flex-col justify-center gap-3 bg-black/70 fixed left-0 top-16 h-[100px] w-[400px] px-3">
          <div className="flex flex-row items-center gap-2">
              <p className="w-[9rem] text-white text-1xl font-exo2">{name}</p>
              <button className="cursor-pointer bg-green-500 rounded-[30%] p-1" 
              onClick={() => changeHp(1)}>
                  <Image src="/Plus.svg" alt="Plus" width={20} height={20} />
              </button>
              <input type="text" inputMode="numeric" value={hpChange} 
              onChange={(event) => handleHpChangeInput(event.target.value)} className="w-10 h-10 bg-white/70 rounded-[30%] text-black text-center items-center justify-center" />
              <button className="cursor-pointer bg-red-500 rounded-[30%] p-1" 
              onClick={() => changeHp(-1)}>
                  <Image src="/Minus.svg" alt="Minus" width={20} height={20} />
              </button>
          </div>
          <div className="flex flex-row">
              <p className="w-[4.5rem] text-center text-white text-1xl font-exo2 absolute left-0">{maxHP}/{hp}</p>
              <div className="relative h-[1.5rem] w-[300px] absolute left-15">
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