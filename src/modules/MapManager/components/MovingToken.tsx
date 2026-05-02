"use client"

import Image from "next/image"
import PrestyledTooltip from "@/components/PrestyledTooltip"
import type { TokenData } from "../types/TokenTypes"
import { Tooltip } from "@base-ui/react/tooltip"
import { useContext, useEffect, useRef } from "react"
import { WorldTransformContext } from "../context/WorldTransform"
import { subscribeToTokenChanges } from "../api/realtime"
import { updateTokenPosition } from "../api/updaters"

// TODO: Add support for initial token position load
export default function MovingToken({
  data,
  gridSize,
  isDraggable,
}: {
  data: TokenData
  gridSize: number
  isDraggable: boolean
}) {
  const transformContext = useContext(WorldTransformContext)
  const { window2WorldTransform, alignToGrid, addEventListenerOnContainer, removeEventListenerOnContainer } =
    transformContext
  const tokenRef = useRef<HTMLButtonElement>(null)

  const tokenSize = gridSize * 0.9

  useEffect(() => {
    if (isDraggable) return
    return subscribeToTokenChanges(data.id, (newX, newY) => {
      const token = tokenRef.current
      if (!token) return
      token.style.left = `${newX}px`
      token.style.top = `${newY}px`
    })
  }, [data.id, isDraggable])

  useEffect(() => {
    if (!isDraggable) return
    if (!tokenRef.current) return
    const token = tokenRef.current
    let shiftX = 0
    let shiftY = 0
    const onMouseDown = (e: MouseEvent) => {
      if (!token || e.button !== 0) return
      e.preventDefault()
      shiftX = e.clientX - token.getBoundingClientRect().x
      shiftY = e.clientY - token.getBoundingClientRect().y
      token.style.cursor = "grabbing"
      addEventListenerOnContainer("mousemove", onmousemove)
      addEventListenerOnContainer("mouseup", onMouseUp)
    }
    const onmousemove = (e: MouseEvent) => {
      if (!token) return
      e.preventDefault()
      const { xInWorld, yInWorld } = window2WorldTransform(e.clientX - shiftX, e.clientY - shiftY)
      token.style.left = `${xInWorld}px`
      token.style.top = `${yInWorld}px`
    }
    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      const { xInWorld, yInWorld } = alignToGrid(e.clientX - shiftX, e.clientY - shiftY)
      token.style.left = `${xInWorld}px`
      token.style.top = `${yInWorld}px`
      token.style.cursor = "default"
      updateTokenPosition(data.id, xInWorld, yInWorld)
      removeEventListenerOnContainer("mousemove", onmousemove)
      removeEventListenerOnContainer("mouseup", onMouseUp)
    }
    token.addEventListener("mousedown", onMouseDown)
    return () => {
      token.removeEventListener("mousedown", onMouseDown)
      removeEventListenerOnContainer("mousemove", onmousemove)
      removeEventListenerOnContainer("mouseup", onMouseUp)
    }
  }, [
    window2WorldTransform,
    alignToGrid,
    addEventListenerOnContainer,
    removeEventListenerOnContainer,
    data.id,
    isDraggable,
  ])

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
