import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export function Dise() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div
      className={`z-20 flex h-[40px] w-12 bg-black/70 transition-all duration-300 ${isOpen ? "flex-col items-center justify-start" : "items-center justify-center"}`}
      style={{
        height: isOpen ? "50vh" : "40px",
        borderTopRightRadius: "10px",
        borderTopLeftRadius: "10px",
      }}
    >
      {isOpen ? (
        <button
          type="button"
          className="mt-3 flex w-full cursor-pointer justify-center"
          onClick={() => setIsOpen(false)}
          aria-label="Свернуть"
        >
          <Image src="/vercel.svg" alt="Close" width={20} height={20} className="rotate-180 rounded-[10%]" />
        </button>
      ) : (
        <button type="button" className="cursor-pointer" onClick={() => setIsOpen(true)} aria-label="Открыть">
          <Image src="public/svgs/d20.svg" alt="Dise" width={24} height={24} className="rotate-180 rounded-[10%]" />
        </button>
      )}
    </div>
  )
}

export function FunBlocks({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="flex w-[21.25rem] flex-col items-center bg-black/70 transition-all duration-300"
      style={{
        height: isOpen ? "40vh" : "2.8rem",
        borderTopRightRadius: "0.625rem",
        borderTopLeftRadius: "0.625rem",
      }}
    >
      {isOpen ? (
        <button className="mt-3 flex w-60 cursor-pointer justify-center" onClick={() => setIsOpen(false)}>
          <Image src="/vercel.svg" alt="Close" width={20} height={20} className="rotate-180 rounded-[10%]" />
        </button>
      ) : (
        <button className="font-exo2 mt-1 cursor-pointer text-2xl text-white" onClick={() => setIsOpen(true)}>
          {text}
        </button>
      )}
    </div>
  )
}
