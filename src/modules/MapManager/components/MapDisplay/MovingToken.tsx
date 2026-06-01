"use client"

import { useEffect, useState } from "react"
import { subscribeToTokenChanges } from "../../api/realtime"
import { Token } from "./Token"
import { Tables } from "@/shared/supabase/dbSchema"

export default function MovingToken({
  data,
  gridSize,
  imageUrl,
}: {
  data: Tables<"character">
  gridSize: number
  imageUrl?: string
}) {
  const [currentData, setCurrentData] = useState<Tables<"character">>(data)

  useEffect(() => {
    return subscribeToTokenChanges(data.id, (newData) => {
      setCurrentData((prev) => ({ ...prev, ...newData }))
    })
  }, [data.id])

  return <Token data={currentData} imageUrl={imageUrl} gridSize={gridSize} />
}
