"use client"
import { MapImage } from "../../types/MapTypes"
import Image from "next/image"
import { MapEditModalContext } from "./MapEditModalContext"
import { useContext, useTransition } from "react"
import twclsx from "@/shared/utils/twClassMerge"
import { Tables } from "@/shared/supabase/dbSchema"
import { usePathname, useRouter } from "next/navigation"

export default function MiniMapField({ mapImage, map }: { mapImage: MapImage; map: Tables<"map"> }) {
  const { openModal } = useContext(MapEditModalContext)
  const [isOpenModalPending, startOpenModalTransition] = useTransition()
  const pathname = usePathname()
  const router = useRouter()
  if (!map) return <></>
  return (
    <div className="relative w-full">
      <button
        className={twclsx(
          "absolute top-1 right-1 rounded-md bg-white/50 p-2 text-black",
          isOpenModalPending && "animate-pulse",
        )}
        onClick={() => {
          startOpenModalTransition(async () => {
            await openModal({ id: map.id })
          })
        }}
      >
        Edit Map
      </button>
      <p className="absolute top-1 left-1 text-white">{map.name}</p>
      <Image
        src={mapImage.mapImageURL}
        alt={`Карта '${map.name}'`}
        width={mapImage.imageWidth}
        height={mapImage.imageHeight}
        sizes="20vw"
        className="h-auto w-full object-contain"
        unoptimized
        onClick={() => {
          router.push(`${pathname}?mapId=${map.id}`)
        }}
      />
    </div>
  )
}
