import Image from "next/image"
import PrestyledTooltip from "@/components/PrestyledTooltip"
import { Tables } from "@/shared/supabase/dbSchema"
import { Tooltip } from "@base-ui/react/tooltip"
import { forwardRef } from "react"
import { fetchTokenImage } from "../../api/fetchers"

interface TokenProps {
  data: Tables<"character">
  imageUrl?: string
  gridSize: number
}
export const Token = forwardRef<HTMLButtonElement, TokenProps>(function Token({ data, imageUrl, gridSize }, tokenRef) {
  const tokenSize = gridSize * 0.9
  return (
    <PrestyledTooltip label={data.name} detail={`${data.current_hp}/${data.max_hp} HP`}>
      <Tooltip.Trigger
        delay={150}
        aria-label={`${data.name}, ${data.current_hp} из ${data.max_hp} HP`}
        className="absolute top-0 left-0 h-full w-full overflow-hidden rounded-full border-[0.2em] border-white shadow-[0_0.2em_0.5em_rgba(0,0,0,0.45)]"
        style={{
          backgroundColor: imageUrl ? undefined : data.color,
          width: `${tokenSize}px`,
          height: `${tokenSize}px`,
          left: `${data.pos_x}px`,
          top: `${data.pos_y}px`,
        }}
        ref={tokenRef}
      >
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill className="object-cover" sizes={`${tokenSize}px`} unoptimized />
        ) : null}
      </Tooltip.Trigger>
    </PrestyledTooltip>
  )
})
