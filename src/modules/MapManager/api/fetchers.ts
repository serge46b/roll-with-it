"use server"

import { createClient } from "@/shared/supabase/server"
import { MapImage } from "../types/MapTypes"
import { Tables } from "@/shared/supabase/dbSchema"

export async function fetchMapImage(worldUUID: string, mapId: number): Promise<MapImage | null> {
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
    throw new Error("Empty meta")
  }
  const meta = metadata.metadata as unknown as { imageWidth: number; imageHeight: number }
  const { imageWidth, imageHeight } = meta
  if (!imageWidth || !imageHeight) {
    throw new Error("Wriong meta")
  }
  const { data: mapImageURL } = await supabase.storage
    .from("ImageStorage")
    .createSignedUrl(`maps/${worldUUID}/${mapId}`, 60)
  if (!mapImageURL?.signedUrl) return null
  return { mapImageURL: mapImageURL.signedUrl, imageWidth, imageHeight }
}

export async function fetchTokenImage(tokenId: number) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  const userId = user?.user?.id
  if (!userId) {
    return
  }
  const { data, error } = await supabase.storage
    .from("ImageStorage")
    .createSignedUrl(`avatars/${userId}/${tokenId}`, 60)
  if (error && error.statusCode !== "404") {
    throw new Error(error.message)
  }
  return data?.signedUrl
}

export async function fetchMapData(worldUUID: string, mapId: number) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("map").select("*").eq("world", worldUUID).eq("id", mapId).single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function fetchAllMaps(worldUUID: string): Promise<{ map: Tables<"map">; mapImage: MapImage }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("map").select("*").eq("world", worldUUID)
  if (error) {
    throw new Error(error.message)
  }
  const mapImagePromises = data.map(async (map) => {
    const mapImage = await fetchMapImage(worldUUID, map.id)
    if (!mapImage?.mapImageURL) {
      throw new Error("Map image not found")
    }
    return mapImage
  })
  const mapImages = await Promise.all(mapImagePromises)
  return data.map((map, index) => ({
    map,
    mapImage: {
      mapImageURL: mapImages[index].mapImageURL,
      imageWidth: mapImages[index].imageWidth,
      imageHeight: mapImages[index].imageHeight,
    },
  }))
}

export async function fetchTokenData(tokenId: number) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("character").select("*").eq("id", tokenId).single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}
