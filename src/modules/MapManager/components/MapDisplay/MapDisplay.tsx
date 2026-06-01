"use client"
import twclsx from "@/shared/utils/twClassMerge"
import Image from "next/image"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { mouseXY2WorldXY } from "../../helpers/CoordTransformers"
import { WorldTransformContext, WorldTransformContextInterface } from "./WorldTransform"

function genWheelHandler(world: HTMLDivElement) {
  return (e: WheelEvent) => {
    if (!world) return
    e.preventDefault()
    // TODO: make zoom origin change depending on moude cursor position
    const newScale = (Number(world.style.scale) || 1) - e.deltaY / 1000
    if (newScale < 0.1) return
    if (newScale > 10) return
    world.style.scale = `${newScale}`
  }
}

function genPanHandlers(world: HTMLDivElement, viewport: HTMLDivElement) {
  // FIXME: Fix math here
  let prevX = 0
  let prevY = 0
  const onMouseDown = (e: MouseEvent) => {
    if (!world || !viewport || e.button !== 1) return
    e.preventDefault()
    prevX = e.clientX
    prevY = e.clientY
    viewport.style.cursor = "grabbing"
    viewport.addEventListener("mousemove", onmousemove)
    viewport.addEventListener("mouseup", onMouseUp)
  }
  const onmousemove = (e: MouseEvent) => {
    if (!world || !viewport) return
    e.preventDefault()
    const scale = Number(world.style.scale) || 1
    const oldX = parseFloat(world.style.left) || 0
    const oldY = parseFloat(world.style.top) || 0
    const newX = oldX + (e.clientX - prevX)
    const newY = oldY + (e.clientY - prevY)
    prevX = e.clientX
    prevY = e.clientY
    world.style.left = `${newX}px`
    world.style.top = `${newY}px`
  }
  const onMouseUp = (e: MouseEvent) => {
    if (!world || !viewport) return
    e.preventDefault()
    viewport.style.cursor = "default"
    viewport.removeEventListener("mousemove", onmousemove)
    viewport.removeEventListener("mouseup", onMouseUp)
  }
  return { onMouseDown, onmousemove, onMouseUp }
}

function genWindow2WorldTransform(world: HTMLDivElement) {
  return (x: number, y: number) => mouseXY2WorldXY(x, y, world)
}

function genAlignToGrid(world: HTMLDivElement, gridSize: number) {
  return (x: number, y: number) => {
    const { xInWorld, yInWorld } = mouseXY2WorldXY(x, y, world)
    const xInGrid = Math.round(xInWorld / gridSize)
    const yInGrid = Math.round(yInWorld / gridSize)
    return { xInGrid, yInGrid }
  }
}

export default function MapDisplay({
  mapImage,
  imageWidth,
  imageHeight,
  gridSize,
  mapName,
  children,
}: {
  mapImage: string
  imageWidth: number
  imageHeight: number
  gridSize: number
  mapName?: string
  children?: React.ReactNode
}) {
  // TODO: Add context that provides resize and grid opacity settinhgs and handlers
  const worldRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [worldTransformContext, setWorldTransformContext] = useState<WorldTransformContextInterface>({
    window2WorldTransform: () => ({ xInWorld: 0, yInWorld: 0 }),
    alignToGrid: () => ({ xInGrid: 0, yInGrid: 0 }),
    addEventListenerOnContainer: () => {},
    removeEventListenerOnContainer: () => {},
  })

  useEffect(() => {
    if (!worldRef.current || !viewportRef.current) return
    const world = worldRef.current
    const viewport = viewportRef.current
    const handleWheel = genWheelHandler(world)
    const { onMouseDown, onmousemove, onMouseUp } = genPanHandlers(world, viewport)
    const window2WorldTransform = genWindow2WorldTransform(world)
    const alignToGrid = genAlignToGrid(world, gridSize)
    setWorldTransformContext({
      window2WorldTransform,
      alignToGrid,
      addEventListenerOnContainer: viewport.addEventListener,
      removeEventListenerOnContainer: viewport.removeEventListener,
    })
    viewport.addEventListener("wheel", handleWheel)
    viewport.addEventListener("mousedown", onMouseDown)
    return () => {
      viewport.removeEventListener("wheel", handleWheel)
      viewport.removeEventListener("mousedown", onMouseDown)
      viewport.removeEventListener("mousemove", onmousemove)
      viewport.removeEventListener("mouseup", onMouseUp)
    }
  }, [gridSize])
  useLayoutEffect(() => {
    if (!worldRef.current || !viewportRef.current) return
    const world = worldRef.current
    const viewport = viewportRef.current
    const vRect = viewport.getBoundingClientRect()
    const scaleX = vRect.width / imageWidth
    const scaleY = vRect.height / imageHeight
    world.style.scale = 1 - scaleX > 1 - scaleY ? `${scaleX * 0.9}` : `${scaleY * 0.9}`
  }, [imageWidth, imageHeight])
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden" ref={viewportRef}>
      {mapName && (
        <div className="absolute top-0.5 left-1/2 z-10 -translate-x-1/2 px-4">
          <p className="rounded-md border border-white/20 bg-[#1b1b1b]/25 px-2 py-1.5 text-center text-medium font-light tracking-wide text-white backdrop-blur-[5px]">
            {mapName}
          </p>
        </div>
      )}
      {isImageLoading && (
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-black/50">
          <p className="animate-pulse text-white">Загрузка карты...</p>
        </div>
      )}
      <div
        className="relative shrink-0 select-none"
        ref={worldRef}
        style={{
          width: imageWidth,
          height: imageHeight,
          transformOrigin: "center center",
          scale: 1,
        }}
      >
        <Image
          src={mapImage}
          alt={mapName ? `Карта «${mapName}»` : "Карта"}
          width={imageWidth}
          height={imageHeight}
          draggable={false}
          className={twclsx("pointer-events-none top-0 left-0 object-contain", isImageLoading ? "invisible" : "")}
          onDragStart={(e) => e.preventDefault()}
          onLoad={() => {
            setIsImageLoading(false)
          }}
          unoptimized
        />
        {!isImageLoading && (
          <>
            <div
              className="absolute top-0 left-0 h-full w-full opacity-15"
              style={{
                backgroundImage: `
                  linear-gradient(to right, transparent 47.5%, #e0e0e0 47.5%, #e0e0e0 52.5%, transparent 52.5%),
                  linear-gradient(to bottom, transparent 47.5%, #e0e0e0 47.5%, #e0e0e0 52.5%, transparent 52.5%)
                `,
                backgroundSize: `${gridSize}px ${gridSize}px`,
                backgroundPosition: `${gridSize / 2}px ${gridSize / 2}px`,
              }}
            />
            <WorldTransformContext value={worldTransformContext}>{children}</WorldTransformContext>
          </>
        )}
      </div>
    </div>
  )
}