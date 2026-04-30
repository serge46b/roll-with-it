"use client"
import twclsx from "@/shared/utils/twClassMerge"
import Image from "next/image"
import { createContext, useEffect, useLayoutEffect, useRef, useState } from "react"
// import { fetchMapImage } from "../api/fetchers"

function mouseXY2WorldXY(mouseX: number, mouseY: number, world: HTMLDivElement) {
  const XInViewport = mouseX - world.getBoundingClientRect().x
  const YInViewport = mouseY - world.getBoundingClientRect().y
  const XInWorld = XInViewport / (Number(world.style.scale) || 1)
  const YInWorld = YInViewport / (Number(world.style.scale) || 1)
  return { XInWorld, YInWorld }
}

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
    const { XInWorld, YInWorld } = mouseXY2WorldXY(x, y, world)
    const xInWorld = Math.round(XInWorld / gridSize) * gridSize
    const yInWorld = Math.round(YInWorld / gridSize) * gridSize
    return { xInWorld, yInWorld }
  }
}

interface WorldTransformContextInterface {
  window2WorldTransform: (x: number, y: number) => { XInWorld: number; YInWorld: number }
  alignToGrid: (x: number, y: number) => { xInWorld: number; yInWorld: number }
}

const WorldTransformContext = createContext<WorldTransformContextInterface>({
  window2WorldTransform: () => ({ XInWorld: 0, YInWorld: 0 }),
  alignToGrid: () => ({ xInWorld: 0, yInWorld: 0 }),
})

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
  const worldRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [worldTransformContext, setWorldTransformContext] = useState<WorldTransformContextInterface>({
    window2WorldTransform: () => ({ XInWorld: 0, YInWorld: 0 }),
    alignToGrid: () => ({ xInWorld: 0, yInWorld: 0 }),
  })

  useEffect(() => {
    if (!worldRef.current || !viewportRef.current) return
    const world = worldRef.current
    const viewport = viewportRef.current
    const handleWheel = genWheelHandler(world)
    const { onMouseDown, onmousemove, onMouseUp } = genPanHandlers(world, viewport)
    const window2WorldTransform = genWindow2WorldTransform(world)
    const alignToGrid = genAlignToGrid(world, gridSize)
    setWorldTransformContext({ window2WorldTransform, alignToGrid })
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
    // world.style.scale = Math.abs(1 - scaleX) > Math.abs(1 - scaleY) ? `${scaleX * 0.9}` : `${scaleY * 0.9}`
    world.style.scale = Math.abs(1 - scaleX) > Math.abs(1 - scaleY) ? `${scaleX}` : `${scaleY}`
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
          onLoadingComplete={() => {
            setIsImageLoading(false)
          }}
          unoptimized
        />
        {!isImageLoading && (
          <>
            <div className="absolute top-0 left-0 h-full w-full bg-red-500/10" />
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
