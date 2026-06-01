"use client"

import { createContext, useContext } from "react"

interface CharacterDataContextInterface {
  characterId: number
}

const CharacterDataContext = createContext<CharacterDataContextInterface>({
  characterId: 0,
})

export default function CharacterDataContextProvider({
  children,
  characterId,
}: {
  children: React.ReactNode
  characterId: number
}) {
  return <CharacterDataContext.Provider value={{ characterId }}>{children}</CharacterDataContext.Provider>
}

export function useCharacterData() {
  const { characterId } = useContext(CharacterDataContext)
  if (!characterId) {
    throw new Error("useCharacterData should be called within CharacterDataContextProvider")
  }
  return characterId
}
