"use client"
import { useState } from "react"
import { CaretDownIcon } from "@/shared/icons/arrow-triangle"
import { Side } from "@/shared/types/SideEnum"
import twclsx from "@/shared/utils/twClassMerge"

export function MenuBlock({
  titleContent,
  className,
  stickSide,
  children,
}: {
  titleContent: React.ReactNode
  className?: string
  stickSide: Side
  children?: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div
      className={twclsx(
        "flex w-full max-w-95 min-w-0 flex-col items-center overflow-hidden bg-black/70 transition-all duration-300",
        className,
      )}
      style={{
        height: isOpen ? "min(40vh, calc(100vh - 3.5rem))" : "2.8rem",
        width: !isOpen && (stickSide === Side.RIGHT || stickSide === Side.LEFT) ? "2.8rem" : undefined,
        borderTopRightRadius: stickSide === Side.BOTTOM || stickSide === Side.LEFT ? "0.625rem" : undefined,
        borderTopLeftRadius: stickSide === Side.BOTTOM || stickSide === Side.RIGHT ? "0.625rem" : undefined,
        borderBottomRightRadius: stickSide === Side.TOP || stickSide === Side.LEFT ? "0.625rem" : undefined,
        borderBottomLeftRadius: stickSide === Side.TOP || stickSide === Side.RIGHT ? "0.625rem" : undefined,
      }}
    >
      <div className="h-full w-full">
        <button
          className={twclsx("flex w-full cursor-pointer justify-center", {
            "justify-start": isOpen && (stickSide === Side.RIGHT || stickSide === Side.LEFT),
          })}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div
            className={twclsx("flex h-[2.8rem] w-[2.8rem] items-center justify-center", {
              "rotate-270": isOpen && stickSide === Side.RIGHT,
            })}
          >
            {isOpen ? <CaretDownIcon /> : titleContent}
          </div>
        </button>
        <div
          className={twclsx(
            "h-[calc(100%-2.8rem)] min-h-0 w-full px-[2.5%] pb-3",
            { "overflow-y-auto": stickSide === Side.BOTTOM || stickSide === Side.TOP },
            { "overflow-x-auto": stickSide === Side.RIGHT || stickSide === Side.LEFT },
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
