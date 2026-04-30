"use client"

import Image from "next/image"
import PrestyledTooltip from "@/components/PrestyledTooltip"
import type { TokenData } from "../types/TokenTypes"
import { Tooltip } from "@base-ui/react/tooltip"
import { useContext, useEffect, useRef } from "react"
import { WorldTransformContext } from "../context/WorldTransform"

export default function DraggableToken({ data, gridSize: grid_size }: { data: TokenData; gridSize: number }) {
  const transformContext = useContext(WorldTransformContext)
  const { window2WorldTransform, alignToGrid, addEventListenerOnContainer, removeEventListenerOnContainer } =
    transformContext
  const tokenRef = useRef<HTMLButtonElement>(null)

  const tokenSize = grid_size * 0.9

  useEffect(() => {
    if (!tokenRef.current) return
    const token = tokenRef.current
    const onMouseDown = (e: MouseEvent) => {
      if (!token || e.button !== 0) return
      e.preventDefault()
      token.style.cursor = "grabbing"
      addEventListenerOnContainer("mousemove", onmousemove)
      addEventListenerOnContainer("mouseup", onMouseUp)
    }
    const onmousemove = (e: MouseEvent) => {
      if (!token) return
      e.preventDefault()
      const { xInWorld, yInWorld } = window2WorldTransform(e.clientX, e.clientY)
      token.style.left = `${xInWorld}px`
      token.style.top = `${yInWorld}px`
    }
    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      const { xInWorld, yInWorld } = alignToGrid(e.clientX, e.clientY)
      token.style.left = `${xInWorld}px`
      token.style.top = `${yInWorld}px`
      token.style.cursor = "default"
      removeEventListenerOnContainer("mousemove", onmousemove)
      removeEventListenerOnContainer("mouseup", onMouseUp)
    }
    token.addEventListener("mousedown", onMouseDown)
    return () => {
      token.removeEventListener("mousedown", onMouseDown)
      removeEventListenerOnContainer("mousemove", onmousemove)
      removeEventListenerOnContainer("mouseup", onMouseUp)
    }
  }, [window2WorldTransform, alignToGrid, addEventListenerOnContainer, removeEventListenerOnContainer])

  return (
    <PrestyledTooltip label={data.name} detail={`${data.currentHp}/${data.maxHp} HP`}>
      <Tooltip.Trigger
        delay={150}
        aria-label={`${data.name}, ${data.currentHp} из ${data.maxHp} HP`}
        className="absolute top-0 left-0 h-full w-full overflow-hidden rounded-full border-[0.2em] border-white shadow-[0_0.2em_0.5em_rgba(0,0,0,0.45)]"
        style={{
          backgroundColor: data.imageUrl ? undefined : data.color,
          width: `${tokenSize}px`,
          height: `${tokenSize}px`,
        }}
        ref={tokenRef}
      >
        {data.imageUrl ? (
          <Image src={data.imageUrl} alt="" fill className="object-cover" sizes={`${tokenSize}px`} unoptimized />
        ) : null}
      </Tooltip.Trigger>
    </PrestyledTooltip>
  )
}
