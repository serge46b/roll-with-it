import { fetchUserWorlds, fetchWorldsWithUserCharacter } from "../api/fetchers"
import PlanetScreen from "./PlanetScreen"
import WorldAddModalContextProvider from "./WorldAddModalContext"

export default async function PlanetScreenPage() {
  const worlds = await fetchUserWorlds()
  const worldsWithUserCharacter = await fetchWorldsWithUserCharacter()
  const allWorlds = [
    ...worlds,
    ...worldsWithUserCharacter.filter((world) => !worlds.some((w) => w.uuid === world.uuid)),
  ]
  return (
    <WorldAddModalContextProvider>
      <PlanetScreen worlds={allWorlds} />
    </WorldAddModalContextProvider>
  )
}
