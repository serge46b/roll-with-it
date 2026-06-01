"use client"

import { createClient } from "@/shared/supabase/client"
import { PreparedImage } from "../helpers/PrepareImage"

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

export async function uploadMapImage(
  worldUUID: string,
  mapName: string,
  preparedImage: PreparedImage,
  gridScale: number,
) {
  const supabase = createClient()
  const { data: mapData, error: mapError } = await supabase
    .from("map")
    .insert({ world: worldUUID, name: mapName, grid_scale_px: gridScale })
    .select("id")
    .single()
    .overrideTypes<{ id: number }>()
  if (mapError) {
    throw new Error(mapError.message)
  }
  const { id: mapId } = mapData
  console.log(`maps/${worldUUID}/${mapId}`)
  const { data, error } = await supabase.storage
    .from("ImageStorage")
    .upload(`maps/${worldUUID}/${mapId}`, preparedImage.imageFile, {
      metadata: { imageWidth: preparedImage.width, imageHeight: preparedImage.height },
    })
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function updateMapData(mapId: number, mapName: string, gridScale: number) {
  const supabase = createClient()
  const { data, error } = await supabase.from("map").update({ name: mapName, grid_scale_px: gridScale }).eq("id", mapId)
  if (error) {
    throw new Error(error.message)
  }
  return data
}
