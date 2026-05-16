import { fetchWeaponsByCharacter } from "../../api/fetchers"
import AddWeaponField from "./AddWeaponField"
import { WeaponCard, WeaponListHeader } from "./WeaponCard"

export default async function WeaponsList({ characterId }: { characterId: number }) {
  const weapons = await fetchWeaponsByCharacter(characterId)

  return (
    <div className="flex w-full flex-col gap-[0.55em]">
      <WeaponListHeader />
      {weapons.map((weapon) => (
        <WeaponCard key={weapon.equipmentItemId} data={weapon} />
      ))}
      <AddWeaponField />
    </div>
  )
}
