"use client"
import { MapImage } from "../../types/MapTypes"
import Image from "next/image"
import { MapEditModalContext } from "./MapEditModalContext"
import { useContext, useTransition } from "react"
import { WorldDataContext } from "@/shared/stores/WorldDataStore"
import twclsx from "@/shared/utils/twClassMerge"

export default function MiniMapField({ mapImage, mapId }: { mapImage: MapImage; mapId: number }) {
  const { openModal } = useContext(MapEditModalContext)
  const { worldUUID } = useContext(WorldDataContext)
  const [isOpenModalPending, startOpenModalTransition] = useTransition()
  if (!mapId) return <></>
  return (
    <div className="relative w-full">
      <button
        className={twclsx(
          "absolute top-1 right-1 z-10 rounded-md bg-white/50 p-2 text-black",
          isOpenModalPending && "animate-pulse",
        )}
        onClick={() => {
          startOpenModalTransition(async () => {
            console.log(mapId)
            await openModal(worldUUID, { id: mapId })
          })
        }}
      >
        Edit Map
      </button>
      <Image
        src={mapImage.mapImageURL}
        alt="Map"
        width={mapImage.imageWidth}
        height={mapImage.imageHeight}
        sizes="20vw"
        className="h-auto w-full object-contain"
        unoptimized
      />
    </div>
  )
}
