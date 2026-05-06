"use client"

import type { TokenData } from "../../types/TokenTypes"
import { useContext, useEffect, useRef } from "react"
import { WorldTransformContext } from "./WorldTransform"
import { updateTokenPosition } from "../../api/updaters"
import { Token } from "./Token"

// TODO: Add support for initial token position load
export default function DraggingToken({ data, gridSize }: { data: TokenData; gridSize: number }) {
  const transformContext = useContext(WorldTransformContext)
  const { window2WorldTransform, alignToGrid, addEventListenerOnContainer, removeEventListenerOnContainer } =
    transformContext
  const tokenRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
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
  }, [window2WorldTransform, alignToGrid, addEventListenerOnContainer, removeEventListenerOnContainer, data.id])

  return <Token data={data} gridSize={gridSize} ref={tokenRef} />
}
