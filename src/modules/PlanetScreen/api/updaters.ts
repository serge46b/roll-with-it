"use server"

import { createClient } from "@/shared/supabase/server"

const MAX_USER_WORLDS = 4

function generateUuidV7(): string {
  const unixMs = Date.now()
  const random = crypto.getRandomValues(new Uint8Array(10))
  const timeHex = unixMs.toString(16).padStart(12, "0")
  const randA = ((random[0] << 8) | random[1]) & 0x0fff
  const randBHigh = (0x80 | (random[2] & 0x3f)) << 8
  const randBLow = random[3]
  const part5 = Array.from(random.subarray(4, 10))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")

  return [
    `${timeHex.slice(0, 8)}`,
    `${timeHex.slice(8, 12)}`,
    (0x7000 | randA).toString(16).padStart(4, "0"),
    (randBHigh | randBLow).toString(16).padStart(4, "0"),
    part5,
  ].join("-")
}

export async function createWorld(name: string, description: string): Promise<string> {
  const trimmedName = name.trim()
  const trimmedDescription = description.trim()

  if (!trimmedName) {
    throw new Error("World name is required")
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw new Error(userError.message)
  }

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { count, error: countError } = await supabase
    .from("world")
    .select("*", { count: "exact", head: true })
    .eq("owner", user.id)

  if (countError) {
    throw new Error(countError.message)
  }

  if ((count ?? 0) >= MAX_USER_WORLDS) {
    throw new Error("Maximum number of worlds reached")
  }

  const uuid = generateUuidV7()
  const { error } = await supabase.from("world").insert({
    uuid,
    name: trimmedName,
    description: trimmedDescription,
    owner: user.id,
  })

  if (error) {
    throw new Error(error.message)
  }

  return uuid
}
