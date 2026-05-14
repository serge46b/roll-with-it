"use client"
import { MapImage } from "../../types/MapTypes"
import Image from "next/image"
import { MapEditModalContext } from "./MapEditModalContext"
import { useContext, useTransition } from "react"
import twclsx from "@/shared/utils/twClassMerge"
import { Tables } from "@/shared/supabase/dbSchema"

export default function MiniMapField({ mapImage, map }: { mapImage: MapImage; map: Tables<"map"> }) {
  const { openModal } = useContext(MapEditModalContext)
  const [isOpenModalPending, startOpenModalTransition] = useTransition()
  if (!map) return <></>
  return (
    <article className="relative w-full overflow-hidden rounded-[0.5em] border border-white/25 bg-black/40 text-[length:1em] text-white">
      <p className="relative z-10 truncate bg-black/75 px-[0.75em] py-[0.55em] text-[0.9em] font-medium tracking-wide text-white">
        {map.name}
      </p>
      <button
        className={twclsx(
          "absolute top-[0.5em] right-[0.25em] z-20 rounded-md border border-white/30 bg-black/60 px-[0.55em] py-[0.25em] text-[0.72em] font-medium text-white transition-colors hover:bg-black/75",
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
      <div className="relative aspect-[2/1] w-full bg-white/10">
        <Image
          src={mapImage.mapImageURL}
          alt={`Карта '${map.name}'`}
          fill
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
      </div>
    </article>
  )
}
