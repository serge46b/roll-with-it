import Image from "next/image"
import { useState } from "react"

//Развертки блоков с Player и Master
export function BlocksPole({ text, children }: { text: string, children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
      <div
          className="w-[21.25rem] bg-black/70 transition-all duration-300 flex flex-col items-center"
          style={{
              height: isOpen ? "40vh" : "2.8rem",
              borderTopRightRadius: "0.625rem",
              borderTopLeftRadius: "0.625rem",
          }}
      >
          {isOpen ? (
              <>
              <button
                  className="mt-3 cursor-pointer w-60 flex justify-center"
                  onClick={() => setIsOpen(false)}>
                  <Image src="/vercel.svg" alt="Close" width={20} height={20} className="rotate-180 rounded-[10%]"/>
              </button>
                  <div className="w-full flex-1 min-h-0 flex items-center justify-start px-[2.5%] pb-3">
                      {children}
                  </div>
              </>
          ) : (
              <button
                  className="mt-1 cursor-pointer text-white text-2xl font-exo2"
                  onClick={() => setIsOpen(true)}>
                  {text}
              </button>
          )}
      </div>
  );
}