"use client"

import { createContext, useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { StyledModal } from "@/components/StyledModal"
import Image from "next/image"

interface RollDiceModalContextInterface {
  openModal: (sides: number, value: number) => void
  closeModal: () => void
}

export const RollDiceModalContext = createContext<RollDiceModalContextInterface>({
  openModal: () => {},
  closeModal: () => {},
})

const RollDiceDialogHandler = Dialog.createHandle()

export function RollDiceModalContextProvider({ children }: { children: React.ReactNode }) {
  const openModal = (sides: number, value: number) => {
    console.log(`d${sides}: ${value}`)
    setDiceSides(sides)
    setDiceValue(value)
    RollDiceDialogHandler.open("context-trigger")
  }
  const closeModal = () => {
    RollDiceDialogHandler.close()
  }
  const [diceSides, setDiceSides] = useState(0)
  const [diceValue, setDiceValue] = useState(0)
  return (
    <>
      <RollDiceModalContext.Provider value={{ openModal, closeModal }}>{children}</RollDiceModalContext.Provider>
      <StyledModal handle={RollDiceDialogHandler}>
        <div className="flex flex-col gap-4 p-8">
          <div className="flex h-[30vh] w-[40vw] flex-col items-center justify-center gap-5 border border-white text-2xl">
            <Image src={`/svgs/dice${diceSides}.svg`} alt={`d${diceSides}`} width={60} height={60}/>
            {`Результат: ${diceValue}!`}
          </div>
        </div>
      </StyledModal>
    </>
  )
}
