import { fetchCharactersByWorld } from "../../api/fetchers"
import AddNpcField from "./AddNpcField"
import { NpcCard } from "./NpcCard"

export default async function NpcsList({ worldUUID }: { worldUUID: string }) {
  const characters = await fetchCharactersByWorld(worldUUID)

  return (
    <div className="flex w-full flex-col gap-[0.55em]">
      {characters.map((character) => (
        <NpcCard key={character.id} data={character} />
      ))}
      <AddNpcField />
    </div>
  )
}
