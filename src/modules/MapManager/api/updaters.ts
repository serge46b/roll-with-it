"use client"

import { createClient } from "@/shared/supabase/client"

export async function updateTokenPosition(tokenId: number, x: number, y: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("character")
    .update({ pos_x: Math.round(x), pos_y: Math.round(y) })
    .eq("id", tokenId)
  if (error) {
    throw new Error(error.message)
  }
  return data
}
