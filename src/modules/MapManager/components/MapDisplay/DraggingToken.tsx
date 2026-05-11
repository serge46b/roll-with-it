"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { WorldTransformContext } from "./WorldTransform"
import { updateTokenPosition } from "../../api/updaters"
import { Token } from "./Token"
import { Tables } from "@/shared/supabase/dbSchema"
import { grid2world } from "../../helpers/CoordTransformers"

// TODO: Add support for initial token position load
export default function DraggingToken({
  data,
  gridSize,
  imageUrl,
}: {
  data: Tables<"character">
  gridSize: number
  imageUrl?: string
}) {
  const transformContext = useContext(WorldTransformContext)
  const { window2WorldTransform, alignToGrid, addEventListenerOnContainer, removeEventListenerOnContainer } =
    transformContext
  const tokenRef = useRef<HTMLButtonElement>(null)
  const [localData, setLocalData] = useState<Tables<"character">>(data)

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
      const { xInGrid, yInGrid } = alignToGrid(e.clientX - shiftX, e.clientY - shiftY)
      token.style.cursor = "default"
      const { xInWorld, yInWorld } = grid2world(xInGrid, yInGrid, gridSize)
      token.style.left = `${xInWorld + (gridSize - parseInt(token.style.width)) / 2}px`
      token.style.top = `${yInWorld + (gridSize - parseInt(token.style.height)) / 2}px`
      updateTokenPosition(data.id, xInGrid, yInGrid)
      removeEventListenerOnContainer("mousemove", onmousemove)
      removeEventListenerOnContainer("mouseup", onMouseUp)
      setLocalData((prev) => ({ ...prev, pos_x: xInGrid, pos_y: yInGrid }))
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
    gridSize,
  ])

  return <Token data={localData} imageUrl={imageUrl} gridSize={gridSize} ref={tokenRef} />
}
