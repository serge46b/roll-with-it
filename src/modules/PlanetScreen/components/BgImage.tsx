"use client"
import Image from "next/image"

export default function BgImage() {
  return (
    <Image
      src="/top100/downsampled space.png"
      alt="Background"
      fill
      priority
      className="pointer-events-none object-cover opacity-0 transition-opacity duration-300"
      onLoad={(e) => {
        ;(e.target as HTMLImageElement).style.opacity = "1"
      }}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
    />
  )
}
