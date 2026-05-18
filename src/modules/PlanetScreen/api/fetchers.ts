"use server"

import { createClient } from "@/shared/supabase/server"
import type { Tables } from "@/shared/supabase/dbSchema"

const MAX_USER_WORLDS = 4

export type UserWorldCardData = {
  uuid: string
  name: string
  description: string
  createdAt: string
}

function formatCreatedAtFromUuid(uuid: string): string {
  if (uuid[14] !== "7") {
    return "Unknown date"
  }
  const timeHex = uuid.replace(/-/g, "").slice(0, 12)
  const ms = Number.parseInt(timeHex, 16)
  if (!Number.isFinite(ms)) {
    return "Unknown date"
  }
  return new Date(ms).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function mapWorldRow(row: Tables<"world">): UserWorldCardData {
  return {
    uuid: row.uuid,
    name: row.name,
    description: row.description,
    createdAt: formatCreatedAtFromUuid(row.uuid),
  }
}

export async function fetchUserWorlds(): Promise<UserWorldCardData[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw new Error(userError.message)
  }

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("world")
    .select("*")
    .eq("owner", user.id)
    .order("uuid", { ascending: false })
    .limit(MAX_USER_WORLDS)

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map(mapWorldRow)
}

export async function fetchWorldsWithUserCharacter(): Promise<UserWorldCardData[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw new Error(userError.message)
  }

  if (!user) {
    return []
  }

  const { data: characters, error: charactersError } = await supabase
    .from("character")
    .select("world")
    .eq("owner", user.id)

  if (charactersError) {
    throw new Error(charactersError.message)
  }

  const worldUuids = [...new Set((characters ?? []).map((row) => row.world))]

  if (worldUuids.length === 0) {
    return []
  }

  const { data: worlds, error: worldsError } = await supabase
    .from("world")
    .select("*")
    .in("uuid", worldUuids)
    .order("uuid", { ascending: false })

  if (worldsError) {
    throw new Error(worldsError.message)
  }

  return (worlds ?? []).map(mapWorldRow)
}
