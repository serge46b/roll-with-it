"use client"
import Image from "next/image"
import { DEFAULT_BACKGROUND_BLUR } from "../constants/Gradients"
import { DEFAULT_SHADOW } from "../constants/Shadows"

export default function Planet({
  className,
  backgroundImage = DEFAULT_BACKGROUND_BLUR,
  shadow = DEFAULT_SHADOW,
  title = "No name given",
  createdAt = "Unknown date",
  showAdd: showAddIcon = false,
  onClick = () => {},
}: {
  className?: string
  backgroundImage?: string
  shadow?: string
  title?: string
  createdAt?: string
  showAdd?: boolean
  onClick: () => void
}) {
  return (
    <div
      className={`aspect-square rounded-full ${className ?? ""}`}
      style={{
        backgroundImage,
        border: "1px solid rgba(22, 19, 22, 0.3)",
        boxShadow: shadow,
      }}
      onClick={onClick}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-white">
        {showAddIcon ? (
          <Image src="/svgs/Plus.svg" alt="" width={60} height={60} />
        ) : (
          <div className="flex w-[220px] flex-col items-center text-center">
            <p className="leading-none font-semibold tracking-[0.05em] whitespace-nowrap">{title}</p>
            <p className="mt-2 text-[16px] leading-none tracking-[0.05em] whitespace-nowrap text-white/85">
              {createdAt}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
