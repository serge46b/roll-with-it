export const SPELL_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const
export type SpellLevel = (typeof SPELL_LEVELS)[number]

export interface WeaponCardData {
  id: number
  equipmentItemId: number
  name: string
  attackBonus: string
  damage: string
  type: string
  description: string
}

export interface WeaponFormValues {
  name: string
  attackBonus: string
  damage: string
  type: string
  description: string
}

export interface SpellCardData {
  id: number
  name: string
  description: string
  level: SpellLevel
}

export interface SpellFormValues {
  name: string
  level: string
  description: string
}

export interface SpellLevelSlotData {
  id: number
  maxSlots: number
  usedSlots: number
}

export type SpellsByLevel = Record<SpellLevel, SpellCardData[]>
export type SlotsByLevel = Record<SpellLevel, SpellLevelSlotData | null>

export interface GmNoteCardData {
  id: number
  note: string
}

export interface GmNoteFormValues {
  note: string
}

export interface NpcCardData {
  id: number
  name: string
  maxHp: number
  currentHp: number
  imageUrl?: string
  accentColor: string
  owner: string
  canEditHp: boolean
}

export interface CharacteristicData {
  id: number
  name: string
  value: number
  flag: string
}

export interface NpcFormValues {
  name: string
  currentHp: number
  maxHp: number
  accentColor: string
}

export interface PlayerCharacterCardData {
  id: number
  name: string
  class: string
  race: string
  level: number
  currentHp: number
  maxHp: number
  hpBonus: number
  defenseClass: number
  speed: number
  alignment: string
  backgroundStory: string
  accentColor: string
  imageUrl?: string
  characteristics: CharacteristicData[]
  canEditHp: boolean
}

export interface PlayerCharacterFormValues {
  name: string
  class: string
  race: string
  level: number
  currentHp: number
  maxHp: number
  hpBonus: number
  defenseClass: number
  speed: number
  alignment: string
  backgroundStory: string
  accentColor: string
}

export function mapCharacterRowToPlayerCard(
  row: {
    id: number
    name: string
    class: string
    race: string
    level: number
    current_hp: number
    max_hp: number
    hp_bonus: number
    defense_class: number
    speed: number
    alignment: string
    background_story: string
    color: string
  },
  imageUrl?: string,
  options?: {
    characteristics?: CharacteristicData[]
    canEditHp?: boolean
  },
): PlayerCharacterCardData {
  return {
    id: row.id,
    name: row.name,
    class: row.class,
    race: row.race,
    level: row.level,
    currentHp: row.current_hp,
    maxHp: row.max_hp,
    hpBonus: row.hp_bonus,
    defenseClass: row.defense_class,
    speed: row.speed,
    alignment: row.alignment,
    backgroundStory: row.background_story,
    accentColor: row.color,
    imageUrl,
    characteristics: options?.characteristics ?? [],
    canEditHp: options?.canEditHp ?? false,
  }
}

export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function formatAbilityModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : String(modifier)
}

export function formatCharacteristicValue(score: number): string {
  return formatAbilityModifier(getAbilityModifier(score))
}

export function formatAttackBonus(bonus: number): string {
  return bonus >= 0 ? `+${bonus}` : `${bonus}`
}

export function parseAttackBonus(value: string): number {
  const trimmed = value.trim()
  if (!trimmed) return 0
  const parsed = Number.parseInt(trimmed.replace(/^\+/, ""), 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function getSpellLevelLabel(level: SpellLevel): string {
  return level === 0 ? "Заговоры" : `Уровень ${level}`
}

export function parseSpellLevel(level: string): SpellLevel | null {
  const trimmed = level.trim().toLowerCase()

  if (trimmed === "0" || trimmed === "заговор" || trimmed === "заговоры" || trimmed === "cantrip" || trimmed === "cantrips") {
    return 0
  }

  const parsed = Number.parseInt(trimmed, 10)
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 9) {
    return null
  }

  return parsed as SpellLevel
}

export function emptySpellsByLevel(): SpellsByLevel {
  return Object.fromEntries(SPELL_LEVELS.map((level) => [level, [] as SpellCardData[]])) as SpellsByLevel
}

export function emptySlotsByLevel(): SlotsByLevel {
  return Object.fromEntries(SPELL_LEVELS.map((level) => [level, null])) as SlotsByLevel
}
