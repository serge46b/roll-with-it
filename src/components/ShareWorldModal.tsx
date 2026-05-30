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
      <Dialog.Trigger handle={ShareWorldModalHandle} className="cursor-pointer bottom-0.5 right-0.5 fixed">
        <Image src="/svgs/link.svg" alt="Share" width={24} height={24} />
      </Dialog.Trigger>
      <StyledModal handle={ShareWorldModalHandle}>
        <div className="flex flex-col gap-4 p-8">
          <Dialog.Title className="text-center text-2xl">Поделиться миром</Dialog.Title>
          {/* <Dialog.Description className="text-center"> */}
          <div className="flex flex-row gap-2 items-center justify-center">
            <p>UID мира: {worldUUID}</p>
              <div
                className="h-6 w-6 rounded-md"
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
                  <Image src="/svgs/check.svg" alt="Copied" width={24} height={24} />
                ) : (
                  <Image src="/svgs/Copy.svg" alt="Copy" width={24} height={24} />
                )}
              </div>
            </div>
            <p>Скопируйте ссылку на мир и отправьте её друзьям или в соцсети</p>
          </div>
          {/* </Dialog.Description> */}
      </StyledModal>
    </>
  )
}
