"use client"

import { createClient } from "@/shared/supabase/client"
import { PreparedImage } from "@/modules/MapManager/helpers/PrepareImage"
import { getOrCreateSpellLevelSlot } from "./fetchers"
import { insertWithGeneratedId } from "./helpers"
import { parseAttackBonus, parseSpellLevel } from "../types/PlayerDataTypes"
import type { GmNoteFormValues, NpcFormValues, PlayerCharacterFormValues, SpellFormValues, WeaponFormValues } from "../types/PlayerDataTypes"

async function getCurrentUserId(): Promise<string> {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    throw new Error(error.message)
  }
  if (!user) {
    throw new Error("Пользователь не авторизован")
  }
  return user.id
}

export async function createWeapon(characterId: number, values: WeaponFormValues) {
  const supabase = createClient()
  const creator = await getCurrentUserId()

  const itemId = await insertWithGeneratedId(supabase, "equipmentitem", {
    name: values.name,
    description: values.description,
    creator,
    equipment_type_flag: "weapon",
  })

  await insertWithGeneratedId(supabase, "weaponequipment", {
    slot: itemId,
    attack_bonus: parseAttackBonus(values.attackBonus),
    damage: values.damage,
    type: values.type,
  })

  await insertWithGeneratedId(supabase, "equipmentslot", {
    character: characterId,
    item: itemId,
    amount: 1,
    is_visible: true,
  })
}

export async function updateWeapon(equipmentItemId: number, values: WeaponFormValues) {
  const supabase = createClient()

  const { data: itemData, error: itemError } = await supabase
    .from("equipmentitem")
    .update({
      name: values.name,
      description: values.description,
    })
    .eq("id", equipmentItemId)
    .select("id")
    .maybeSingle()

  if (itemError) {
    throw new Error(itemError.message)
  }

  if (!itemData) {
    throw new Error("Оружие не найдено или обновление заблокировано")
  }

  const { data: weaponData, error: weaponError } = await supabase
    .from("weaponequipment")
    .update({
      attack_bonus: parseAttackBonus(values.attackBonus),
      damage: values.damage,
      type: values.type,
    })
    .eq("slot", equipmentItemId)
    .select("id")
    .maybeSingle()

  if (weaponError) {
    throw new Error(weaponError.message)
  }

  if (!weaponData) {
    throw new Error("Запись экипировки не найдена или обновление заблокировано")
  }
}

export async function createSpell(characterId: number, values: SpellFormValues) {
  const level = parseSpellLevel(values.level)
  if (level === null) {
    throw new Error("Некорректный уровень заклинания")
  }

  const slotId = await getOrCreateSpellLevelSlot(characterId, level)
  const supabase = createClient()

  await insertWithGeneratedId(supabase, "spell", {
    name: values.name,
    description: values.description,
    spell_level: slotId,
  })
}

export async function updateSpell(spellId: number, characterId: number, values: SpellFormValues) {
  const level = parseSpellLevel(values.level)
  if (level === null) {
    throw new Error("Некорректный уровень заклинания")
  }

  const slotId = await getOrCreateSpellLevelSlot(characterId, level)
  const supabase = createClient()

  const { data, error } = await supabase
    .from("spell")
    .update({
      name: values.name,
      description: values.description,
      spell_level: slotId,
    })
    .eq("id", spellId)
    .select("id")
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error("Заклинание не найдено или обновление заблокировано")
  }
}

export async function updateSpellUsedSlots(slotId: number, usedSlots: number, maxSlots: number) {
  const clamped = Math.min(maxSlots, Math.max(0, usedSlots))
  const supabase = createClient()

  const { error } = await supabase.from("spelllevelslot").update({ used_slots: clamped }).eq("id", slotId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function createGmNote(worldUUID: string, values: GmNoteFormValues) {
  const supabase = createClient()

  await insertWithGeneratedId(supabase, "worldnote", {
    note: values.note,
    world: worldUUID,
  })
}

export async function updateGmNote(noteId: number, values: GmNoteFormValues) {
  const supabase = createClient()

  const { error } = await supabase.from("worldnote").update({ note: values.note }).eq("id", noteId)

  if (error) {
    throw new Error(error.message)
  }
}

const DEFAULT_NPC_FIELDS = {
  alignment: "",
  background_story: "",
  class: "",
  defense_class: 10,
  hp_bonus: 0,
  level: 1,
  race: "",
  speed: 30,
  map: null as number | null,
  pos_x: null as number | null,
  pos_y: null as number | null,
}

export async function createCharacter(worldUUID: string, values: NpcFormValues) {
  const supabase = createClient()
  const owner = await getCurrentUserId()

  return insertWithGeneratedId(supabase, "character", {
    ...DEFAULT_NPC_FIELDS,
    name: values.name,
    current_hp: values.currentHp,
    max_hp: values.maxHp,
    color: values.accentColor,
    world: worldUUID,
    owner,
  })
}

export async function createPlayerCharacter(worldUUID: string, values: PlayerCharacterFormValues, image?: PreparedImage) {
  const supabase = createClient()
  const owner = await getCurrentUserId()

  const characterId = await insertWithGeneratedId(supabase, "character", {
    ...DEFAULT_NPC_FIELDS,
    name: values.name,
    class: values.class,
    race: values.race,
    level: values.level,
    current_hp: values.currentHp,
    max_hp: values.maxHp,
    hp_bonus: values.hpBonus,
    defense_class: values.defenseClass,
    speed: values.speed,
    alignment: values.alignment,
    background_story: values.backgroundStory,
    color: values.accentColor,
    world: worldUUID,
    owner,
  })

  if (image) {
    await uploadCharacterAvatar(owner, characterId, image)
  }

  return characterId
}

export async function updateCharacter(characterId: number, values: NpcFormValues) {
  const supabase = createClient()

  const { error } = await supabase
    .from("character")
    .update({
      name: values.name,
      current_hp: values.currentHp,
      max_hp: values.maxHp,
      color: values.accentColor,
    })
    .eq("id", characterId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function updateCharacterCurrentHp(characterId: number, currentHp: number) {
  const supabase = createClient()

  const { data, error: fetchError } = await supabase
    .from("character")
    .select("max_hp, owner")
    .eq("id", characterId)
    .single()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw new Error(userError.message)
  }

  if (!user || data.owner !== user.id) {
    throw new Error("Нет прав на изменение HP")
  }

  const clamped = Math.min(data.max_hp, Math.max(0, currentHp))

  const { error } = await supabase.from("character").update({ current_hp: clamped }).eq("id", characterId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function uploadCharacterAvatar(ownerId: string, characterId: number, preparedImage: PreparedImage) {
  const supabase = createClient()

  const { error } = await supabase.storage
    .from("ImageStorage")
    .upload(`avatars/${ownerId}/${characterId}`, preparedImage.imageFile, { upsert: true })

  if (error) {
    throw new Error(error.message)
  }
}
