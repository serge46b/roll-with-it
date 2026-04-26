"use client"

import Image from "next/image"
import { useState } from "react"    
import { ActionPanelFrame as Frame } from "@/components/Frame"

const PANEL_INPUT_CLASS =
  "rounded-md border border-white/80 bg-[#1b1b1b]/40 px-4 py-3 text-lg font-light tracking-wide text-white placeholder:text-white/50 outline-none focus:border-white";

function WideActionPanel({ mode }: { mode: "create" | "connect" }) {
  const [worldName, setWorldName] = useState("");
  const [worldDescription, setWorldDescription] = useState("");
  const [worldLink, setWorldLink] = useState("");

  const title = mode === "create" ? "СОЗДАТЬ МИР" : "ПОДКЛЮЧИТЬСЯ К МИРУ";

  return (
    <div className="relative h-[468px] w-[760px]">
      <div className="flex h-full w-full flex-col border-2 border-white bg-[#1b1b1b]/20 px-[16px] py-[24px] backdrop-blur-[5px]">
        <p className="shrink-0 text-center text-4xl font-light tracking-wide text-white pt-[20px]">
          {title}
        </p>
        <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-6">
          {mode === "create" ? (
            <>
              <input
                type="text"
                value={worldName}
                onChange={(event) => setWorldName(event.target.value)}
                placeholder="Название мира"
                className={`${PANEL_INPUT_CLASS} w-full max-w-[390px]`}
              />
              <textarea
                value={worldDescription}
                onChange={(event) => setWorldDescription(event.target.value)}
                placeholder="Описание мира"
                rows={6}
                className={`${PANEL_INPUT_CLASS} max-h-[160px] min-h-[100px] w-full max-w-[560px] resize-none overflow-y-auto`}
              />
              <button className="cursor-pointer" onClick={() => console.log("Создать мир")}>
                <Image src="/svgs/check.svg" alt="Check" width={40} height={40} />
              </button>
            </>
          ) : (
            <>
            <input
              type="url"
              value={worldLink}
              onChange={(event) => setWorldLink(event.target.value)}
              placeholder="Введите ссылку"
              className={`${PANEL_INPUT_CLASS} w-full max-w-[560px]`}
            />
            <button className="cursor-pointer" onClick={() => console.log("Подключиться к миру")}>
                <Image src="/svgs/check.svg" alt="Check" width={40} height={40} />
            </button>
            </>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute left-0 top-0 h-[500px] w-[200px] overflow-hidden">
          <Frame className="left-0 top-0" width={400} height={500} />
        </div>
        <div className="absolute right-0 top-0 h-[500px] w-[200px] overflow-hidden">
          <Frame className="right-0 top-0" width={400} height={500} />
        </div>
        <div className="absolute left-[200px] right-[200px] top-0 h-[4px] bg-white" />
        <div className="absolute bottom-0 left-[200px] right-[200px] h-[4px] bg-white" />
      </div>
    </div>
  );
}

//Рамка для всех
function ActionPanelFrame({ className = "" , width, height }: { className?: string , width: number, height: number }) {
  return (
    <svg
      className={`absolute h-[${height}px] w-[${width}px] ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="presentation"
      aria-hidden="true"
    >
      <path
        d="M348.153 2C350.146 28.1935 371.542 48.9614 398 49.9619V448.037C370.872 449.063 349.064 470.872 348.038 498H51.9619C50.936 470.872 29.1284 449.063 2 448.037V51.9619C29.1284 50.936 50.936 29.1284 51.9619 2H348.153Z"
        fill="none"
        stroke="white"
        strokeWidth={4}
        strokeLinejoin="miter"
      />
    </svg>
  );
}