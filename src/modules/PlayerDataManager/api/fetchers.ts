"use server"

import { createClient } from "@/shared/supabase/server"
import { insertWithGeneratedId } from "./helpers"
import {
  emptySlotsByLevel,
  emptySpellsByLevel,
  formatAttackBonus,
  SPELL_LEVELS,
  type GmNoteCardData,
  type CharacteristicData,
  type NpcCardData,
  type PlayerCharacterCardData,
  mapCharacterRowToPlayerCard,
  type SpellCardData,
  type SpellLevel,
  type SpellsByLevel,
  type SlotsByLevel,
  type WeaponCardData,
} from "../types/PlayerDataTypes"

export async function fetchWeaponsByCharacter(characterId: number): Promise<WeaponCardData[]> {
  const supabase = await createClient()
  const { data: slots, error: slotsError } = await supabase
    .from("equipmentslot")
    .select("id, item")
    .eq("character", characterId)

  if (slotsError) {
    throw new Error(slotsError.message)
  }

  if (!slots?.length) {
    return []
  }

  const itemIds = slots.map((slot) => slot.item)

  const [{ data: items, error: itemsError }, { data: weaponRows, error: weaponsError }] = await Promise.all([
    supabase.from("equipmentitem").select("id, name, description").in("id", itemIds),
    supabase.from("weaponequipment").select("slot, attack_bonus, damage, type").in("slot", itemIds),
  ])

  if (itemsError) {
    throw new Error(itemsError.message)
  }
  if (weaponsError) {
    throw new Error(weaponsError.message)
  }

  const weaponByItemId = new Map((weaponRows ?? []).map((row) => [row.slot, row]))
  const slotIdByItemId = new Map(slots.map((slot) => [slot.item, slot.id]))

  const weapons: WeaponCardData[] = []
  for (const item of items ?? []) {
    const weapon = weaponByItemId.get(item.id)
    const slotId = slotIdByItemId.get(item.id)
    if (!weapon || slotId === undefined) continue

    weapons.push({
      id: slotId,
      equipmentItemId: item.id,
      name: item.name,
      description: item.description,
      attackBonus: formatAttackBonus(weapon.attack_bonus),
      damage: weapon.damage,
      type: weapon.type,
    })
  }

  return weapons
}

export async function fetchWeaponByEquipmentItemId(equipmentItemId: number): Promise<WeaponCardData | null> {
  const supabase = await createClient()

  const [{ data: item, error: itemError }, { data: weapon, error: weaponError }, { data: slot, error: slotError }] =
    await Promise.all([
      supabase.from("equipmentitem").select("id, name, description").eq("id", equipmentItemId).single(),
      supabase.from("weaponequipment").select("attack_bonus, damage, type").eq("slot", equipmentItemId).maybeSingle(),
      supabase.from("equipmentslot").select("id").eq("item", equipmentItemId).maybeSingle(),
    ])

  if (itemError) {
    throw new Error(itemError.message)
  }
  if (weaponError) {
    throw new Error(weaponError.message)
  }
  if (slotError) {
    throw new Error(slotError.message)
  }
  if (!weapon || !slot) return null

  return {
    id: slot.id,
    equipmentItemId: item.id,
    name: item.name,
    description: item.description,
    attackBonus: formatAttackBonus(weapon.attack_bonus),
    damage: weapon.damage,
    type: weapon.type,
  }
}

export async function fetchSpellsByCharacter(characterId: number): Promise<SpellsByLevel> {
  const grouped = emptySpellsByLevel()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("spelllevelslot")
    .select(
      `
      id,
      level,
      spell ( id, name, description )
    `,
    )
    .eq("character", characterId)

  if (error) {
    throw new Error(error.message)
  }

  for (const row of data ?? []) {
    const level = row.level as SpellLevel
    if (!SPELL_LEVELS.includes(level)) continue

    for (const spell of row.spell ?? []) {
      grouped[level].push({
        id: spell.id,
        name: spell.name,
        description: spell.description,
        level,
      })
    }
  }

  return grouped
}

export async function fetchSpellLevelSlotsByCharacter(characterId: number): Promise<SlotsByLevel> {
  const slots = emptySlotsByLevel()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("spelllevelslot")
    .select("id, level, max_slots_count, used_slots")
    .eq("character", characterId)

  if (error) {
    throw new Error(error.message)
  }

  for (const row of data ?? []) {
    const level = row.level as SpellLevel
    if (!SPELL_LEVELS.includes(level)) continue

    slots[level] = {
      id: row.id,
      maxSlots: row.max_slots_count,
      usedSlots: row.used_slots,
    }
  }

  return slots
}

export async function fetchSpellById(spellId: number): Promise<SpellCardData | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("spell")
    .select(
      `
      id,
      name,
      description,
      spelllevelslot:spell_level ( level )
    `,
    )
    .eq("id", spellId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const level = data.spelllevelslot?.level as SpellLevel | undefined
  if (level === undefined || !SPELL_LEVELS.includes(level)) return null

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    level,
  }
}

export async function getOrCreateSpellLevelSlot(characterId: number, level: SpellLevel): Promise<number> {
  const supabase = await createClient()
  const { data: existing, error: fetchError } = await supabase
    .from("spelllevelslot")
    .select("id")
    .eq("character", characterId)
    .eq("level", level)
    .maybeSingle()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  if (existing) {
    return existing.id
  }

  return insertWithGeneratedId(supabase, "spelllevelslot", {
    character: characterId,
    level,
    max_slots_count: 1,
    used_slots: 0,
  })
}

export async function fetchGmNotesByWorld(worldUUID: string): Promise<GmNoteCardData[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("worldnote").select("id, note").eq("world", worldUUID)

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((row) => ({ id: row.id, note: row.note }))
}

export async function fetchGmNoteById(noteId: number): Promise<GmNoteCardData | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("worldnote").select("id, note").eq("id", noteId).single()

  if (error) {
    throw new Error(error.message)
  }

  return { id: data.id, note: data.note }
}

export async function fetchCharacteristicsByCharacter(characterId: number): Promise<CharacteristicData[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("characteristic")
    .select("id, name, value, flag")
    .eq("character", characterId)

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    value: row.value,
    flag: row.flag,
  }))
}

export async function fetchCharactersByWorld(worldUUID: string): Promise<NpcCardData[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw new Error(userError.message)
  }

  const { data, error } = await supabase.from("character").select("*").eq("world", worldUUID)

  if (error) {
    throw new Error(error.message)
  }

  const characters = await Promise.all(
    (data ?? []).map(async (row) => {
      const imageUrl = await fetchCharacterImage(row.id, row.owner)
      return {
        id: row.id,
        name: row.name,
        currentHp: row.current_hp,
        maxHp: row.max_hp,
        accentColor: row.color,
        owner: row.owner,
        imageUrl,
        canEditHp: Boolean(user && row.owner === user.id),
      }
    }),
  )

  return characters
}

export async function fetchCharacterById(characterId: number): Promise<NpcCardData | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("character").select("*").eq("id", characterId).single()

  if (error) {
    throw new Error(error.message)
  }

  const imageUrl = await fetchCharacterImage(data.id, data.owner)

  return {
    id: data.id,
    name: data.name,
    currentHp: data.current_hp,
    maxHp: data.max_hp,
    accentColor: data.color,
    owner: data.owner,
    imageUrl,
    canEditHp: false,
  }
}

export async function fetchPlayerCharacterByWorld(worldUUID: string): Promise<PlayerCharacterCardData | null> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw new Error(userError.message)
  }

  if (!user) {
    return null
  }
  const { data, error } = await supabase
    .from("character")
    .select("*")
    .eq("world", worldUUID)
    .eq("owner", user.id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    return null
  }

  const imageUrl = await fetchCharacterImage(data.id, data.owner)
  const characteristics = await fetchCharacteristicsByCharacter(data.id)

  return mapCharacterRowToPlayerCard(data, imageUrl, {
    characteristics,
    canEditHp: true,
  })
}

export async function fetchCharacterImage(characterId: number, ownerId: string): Promise<string | undefined> {
  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from("ImageStorage")
    .createSignedUrl(`avatars/${ownerId}/${characterId}`, 60)

  if (error && error.statusCode !== "404") {
    throw new Error(error.message)
  }

  return data?.signedUrl
}
