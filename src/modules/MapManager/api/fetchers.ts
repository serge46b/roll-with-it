"use server"

import { createClient } from "@/shared/supabase/server"
import { Character } from "@/shared/types/dbSchema"

export async function fetchMapImage(worldUUID: string, mapId: number) {
  const supabase = await createClient()
  const { data: metadata, error: metadataError } = await supabase.storage
    .from("ImageStorage")
    .info(`maps/${worldUUID}/${mapId}`)
  if (metadataError) {
    throw new Error(metadataError.message)
  }
  if (!metadata) {
    return null
  }
  if (!metadata.metadata) {
    throw new Error("Wriong meta")
  }
  const meta = metadata.metadata as unknown as { imageWidth: number; imageHeight: number }
  const { imageWidth, imageHeight } = meta
  if (!imageWidth || !imageHeight) {
    throw new Error("Wriong meta")
  }
  const { data: mapImageURL } = await supabase.storage
    .from("ImageStorage")
    .createSignedUrl(`maps/${worldUUID}/${mapId}`, 60)
  // console.log(mapImageURL)
  return { mapImageURL: mapImageURL?.signedUrl, imageWidth, imageHeight }
  // return { mapImageURL: mapImageURL?.signedUrl, imageWidth: 2000, imageHeight: 2000 }
}

export async function fetchTokenData(tokenId: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("character")
    .select("*")
    .eq("id", tokenId)
    .single()
    .overrideTypes<Character>()
  if (error) {
    throw new Error(error.message)
  }
  return data
}
