"use client"
import twclsx from "@/shared/utils/twClassMerge"
import Image from "next/image"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
// import { fetchMapImage } from "../api/fetchers"
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
  let shiftX = 9
  let shiftY = 0
  const onMouseDown = (e: MouseEvent) => {
    if (!world || !viewport || e.button !== 1) return
    e.preventDefault()
    const wRect = world.getBoundingClientRect()
    shiftX = e.clientX - wRect.x
    shiftY = e.clientY - wRect.y
    world.style.cursor = "grabbing"
    viewport.addEventListener("mousemove", onmousemove)
    viewport.addEventListener("mouseup", onMouseUp)
  }
  const onmousemove = (e: MouseEvent) => {
    if (!world || !viewport) return
    e.preventDefault()
    const newX = e.clientX - shiftX
    const newY = e.clientY - shiftY
    console.log(shiftX, shiftY)
    world.style.left = `${newX}px`
    world.style.top = `${newY}px`
  }
  const onMouseUp = (e: MouseEvent) => {
    if (!world || !viewport) return
    e.preventDefault()
    world.style.cursor = "default"
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
    // TODO: Write snap math
    return { xInWorld, yInWorld }
  }
}

export default function MapDisplay({
  mapImage,
  imageWidth,
  imageHeight,
  gridSize,
  children,
}: {
  mapImage: string
  imageWidth: number
  imageHeight: number
  gridSize: number
  children?: React.ReactNode
}) {
  // TODO: Add context that provides resize and grid opacity settinhgs and handlers
  const worldRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [worldTransformContext, setWorldTransformContext] = useState<WorldTransformContextInterface>({
    window2WorldTransform: () => ({ xInWorld: 0, yInWorld: 0 }),
    alignToGrid: () => ({ xInWorld: 0, yInWorld: 0 }),
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
    <div className="flex h-full w-full items-center justify-center overflow-hidden" ref={viewportRef}>
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
          alt="Map"
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
                backgroundImage: `linear-gradient(to right, #e0e0e0 5%, transparent 5%), linear-gradient(to bottom, #e0e0e0 5%, transparent 5%)`,
                // backgroundImage: `linear-gradient(to right, #e0e0e0 ${imageWidth * 0.001}px, transparent ${imageWidth * 0.001}px), linear-gradient(to bottom, #e0e0e0 ${imageWidth * 0.001}px, transparent ${imageWidth * 0.001}px)`,
                backgroundSize: `${gridSize}px ${gridSize}px`,
              }}
            />
            <WorldTransformContext value={worldTransformContext}>{children}</WorldTransformContext>
          </>
        )}
      </div>
    </div>
  )
}

// export default async function MapDisplay() {
//   const mapData = await fetchMapImage("1f15cc67-e53b-60d0-bb0f-72694ce2d375", 1)
//   if (!mapData || !mapData.mapImageURL) {
//     return <div>Critical error</div>
//   }
//   const { mapImageURL, imageWidth, imageHeight } = mapData
//   return (
//     <div className="flex h-full w-full items-center justify-center overflow-hidden">
//       <Image
//         src={mapImageURL}
//         alt="Map"
//         width={imageWidth}
//         height={imageHeight}
//         className="object-contain"
//         unoptimized
//       />
//     </div>
//   )
// }
