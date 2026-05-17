import { fetchPlayerCharacterByWorld } from "../../api/fetchers"
import AddCharacterField from "./AddCharacterField"
import { PlayerCharacterCard } from "./PlayerCharacterCard"

export default async function CharacterPanel({ worldUUID }: { worldUUID: string }) {
  try {
    const character = await fetchPlayerCharacterByWorld(worldUUID)

    if (character) {
      return <PlayerCharacterCard data={character} />
    }
  } catch (error) {
    console.error(error)
    return <p>Error fetching player character</p>
  }

  return <AddCharacterField />
}
