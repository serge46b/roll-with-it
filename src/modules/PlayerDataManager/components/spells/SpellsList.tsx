import { fetchSpellLevelSlotsByCharacter, fetchSpellsByCharacter } from "../../api/fetchers"
import AddSpellField from "./AddSpellField"
import { SpellLevelList } from "./SpellLevelList"

export default async function SpellsList({ characterId }: { characterId: number }) {
  if (characterId === -1) {
    return <p>Создайте персонажа</p>
  }
  const [spellsByLevel, slotsByLevel] = await Promise.all([
    fetchSpellsByCharacter(characterId),
    fetchSpellLevelSlotsByCharacter(characterId),
  ])

  return (
    <div className="flex w-full flex-col gap-[0.55em]">
      <SpellLevelList spellsByLevel={spellsByLevel} slotsByLevel={slotsByLevel} />
      <AddSpellField />
    </div>
  )
}
