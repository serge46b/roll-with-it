"use client"
import { createContext, useContext } from "react"

interface WorldDataContextInterface {
  worldUUID: string
}

const WorldDataContext = createContext<WorldDataContextInterface>({
  worldUUID: "",
})

export default function WorldDataContextProvider({
  children,
  worldUUID,
}: {
  children: React.ReactNode
  worldUUID: string
}) {
  return <WorldDataContext.Provider value={{ worldUUID }}>{children}</WorldDataContext.Provider>
}

export function useWorldData() {
  const { worldUUID } = useContext(WorldDataContext)
  if (!worldUUID) {
    throw new Error("useWorldData should be called within WorldDataContextProvider")
  }
  return worldUUID
}
