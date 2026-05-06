"use client"

import type { TokenData } from "../../types/TokenTypes"
import { useEffect, useState } from "react"
import { subscribeToTokenChanges } from "../../api/realtime"
import { Token } from "./Token"

export default function MovingToken({ data, gridSize }: { data: TokenData; gridSize: number }) {
  const [currentData, setCurrentData] = useState<TokenData>(data)

  useEffect(() => {
    return subscribeToTokenChanges(data.id, (newData) => {
      setCurrentData((prev) => ({ ...prev, ...newData }))
    })
  }, [data.id])

  return <Token data={currentData} gridSize={gridSize} />
}
