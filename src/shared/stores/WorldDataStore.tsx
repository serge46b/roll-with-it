"use client"
import { createContext } from "react"

interface WorldDataContextInterface {
  worldUUID: string
}

export const WorldDataContext = createContext<WorldDataContextInterface>({
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
