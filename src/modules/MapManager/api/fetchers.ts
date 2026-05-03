"use server"

import { createClient } from "@/shared/supabase/server"
import { Character } from "@/shared/types/dbSchema"

export async function fetchMapImage(worldUUID: string, mapId: number) {
  const supabase = await createClient()
  const { data: metadata, error: metadataError } = await supabase.storage
    .from("ImageStorage")
    .info(`maps/${worldUUID}/${mapId}.jpg`)
  if (metadataError) {
    throw new Error(metadataError.message)
  }
  // if (!metadata) {
  //   return null
  // }
  // const meta = metadata.metadata as { user_metadata?: { imageWidth: number; imageHeight: number } }
  // if (!meta.user_metadata) {
  //   throw new Error("Wriong meta")
  // }
  // const { imageWidth, imageHeight } = meta.user_metadata
  // if (!imageWidth || !imageHeight) {
  //   throw new Error("Wriong meta")
  // }
  const { data: mapImageURL } = await supabase.storage
    .from("ImageStorage")
    .createSignedUrl(`maps/${worldUUID}/${mapId}`, 60)
  // return { mapImageURL, imageWidth, imageHeight }
  return { mapImageURL: mapImageURL?.signedUrl, imageWidth: 2000, imageHeight: 2000 }
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
