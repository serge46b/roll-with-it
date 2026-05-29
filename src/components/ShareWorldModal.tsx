"use client"

import { Dialog } from "@base-ui/react/dialog"
import { StyledModal } from "./StyledModal"
import Image from "next/image"
import { useState, useTransition } from "react"
import twclsx from "@/shared/utils/twClassMerge"

const ShareWorldModalHandle = Dialog.createHandle()

export default function ShareWorld({ worldUUID }: { worldUUID: string }) {
  const [isClipboardPending, startClipboardTransition] = useTransition()
  const [isCopied, setIsCopied] = useState(false)

  return (
    <>
      <Dialog.Trigger handle={ShareWorldModalHandle}>
        <Image src="/svgs/link.svg" alt="Поделиться миром" width={24} height={24} />
      </Dialog.Trigger>
      <StyledModal handle={ShareWorldModalHandle}>
        <div className="flex flex-col gap-4 p-8">
          <Dialog.Title className="text-center">Поделиться миром</Dialog.Title>
          {/* <Dialog.Description className="text-center"> */}
          <div>
            UID мира:{" "}
            <span className={twclsx("font-bold", isClipboardPending && "animate-pulse")}>
              {worldUUID}{" "}
              <div
                className="h-4 w-4 rounded-md border border-white/25 bg-black"
                onClick={() =>
                  startClipboardTransition(async () => {
                    await navigator.clipboard.writeText(worldUUID)
                    setIsCopied(true)
                    setTimeout(() => {
                      setIsCopied(false)
                    }, 1000)
                  })
                }
              >
                {isCopied ? (
                  <Image src="/svgs/check.svg" alt="Скопировано" width={16} height={16} />
                ) : (
                  <Image src="/svgs/send.svg" alt="Копировать" width={16} height={16} />
                )}
              </div>
            </span>
            <br />
            Коротенький текст о том, как делится
          </div>
          {/* </Dialog.Description> */}
        </div>
      </StyledModal>
    </>
  )
}
