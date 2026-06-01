import Image from "next/image"
import PrestyledTooltip from "@/components/PrestyledTooltip"
import type { TokenData } from "../types/TokenTypes"
import { Tooltip } from "@base-ui/react/tooltip"
import { forwardRef } from "react"

interface TokenProps {
  data: TokenData
  gridSize: number
}
export const Token = forwardRef<HTMLButtonElement, TokenProps>(function Token({ data, gridSize }, tokenRef) {
  const tokenSize = gridSize * 0.9
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
          left: `${data.pos_x}px`,
          top: `${data.pos_y}px`,
        }}
        ref={tokenRef}
      >
        {data.imageUrl ? (
          <Image src={data.imageUrl} alt="" fill className="object-cover" sizes={`${tokenSize}px`} unoptimized />
        ) : null}
      </Tooltip.Trigger>
    </PrestyledTooltip>
  )
})
