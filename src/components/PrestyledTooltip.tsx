"use client"
import { Tooltip } from "@base-ui/react/tooltip"
import type { ReactNode } from "react"

import twclsx from "@/shared/utils/twClassMerge"
export const SPAN_TOOLTIP_POPUP_CLASS =
  "z-[100] w-max max-w-[9em] rounded-[0.3em] border border-white/25 bg-black/85 px-[0.45em] py-[0.22em] text-center text-[length:0.72em] uppercase tracking-wide text-white/90 shadow-lg outline-none data-[closed]:hidden"

export default function PrestyledTooltip({
  label,
  detail,
  children,
}: {
  label: string
  detail?: ReactNode
  children: ReactNode
}) {
  return (
    <Tooltip.Root>
      {children}
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={6} positionMethod="fixed" className="z-100">
          <Tooltip.Popup className={twclsx(SPAN_TOOLTIP_POPUP_CLASS, detail && "normal-case")}>
            <p>{label}</p>
            {detail ? <p className="mt-[0.15em] font-normal text-white/75">{detail}</p> : null}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
