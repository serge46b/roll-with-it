"use client"

import { Dialog } from "@base-ui/react"
import { ReactNode } from "react"

// TODO: Style it later
export function StyledModal({ children, handle }: { children: ReactNode; handle?: Dialog.Handle<unknown> }) {
  return (
    <Dialog.Root handle={handle}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-50" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -mt-8 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-4 shadow-[0.25rem_0.25rem_0] shadow-black/12 transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
          <Frame>{children}</Frame>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-fit">
      <div className="m-3 h-fit max-h-[80vh] min-h-30 w-fit max-w-[80vw] min-w-30 overflow-auto border border-neutral-400">
        {children}
      </div>
      <div className="absolute top-0 left-8 h-0 w-[calc(100%-4rem)] border-t-2 border-white"></div>
      <div className="absolute top-8 right-0 h-[calc(100%-4rem)] w-0 border-r-2 border-white"></div>
      <div className="absolute right-8 bottom-0 h-0 w-[calc(100%-4rem)] border-b-2 border-white"></div>
      <div className="absolute bottom-8 left-0 h-[calc(100%-4rem)] w-0 border-l-2 border-white"></div>
      <div className="absolute -top-8 -left-8 h-16 w-16 rotate-45 rounded-full border-2 border-transparent border-r-white"></div>
      <div className="absolute -top-8 -right-8 h-16 w-16 rotate-45 rounded-full border-2 border-transparent border-b-white"></div>
      <div className="absolute -right-8 -bottom-8 h-16 w-16 rotate-45 rounded-full border-2 border-transparent border-l-white"></div>
      <div className="absolute -bottom-8 -left-8 h-16 w-16 rotate-45 rounded-full border-2 border-transparent border-t-white"></div>
    </div>
  )
}
