import { fetchAllMaps } from "../api/fetchers"
import AddMapField from "./MapEdit/AddMapField"
import MiniMapField from "./MapEdit/MiniMapField"

export default async function MapsList({ worldUUID }: { worldUUID: string }) {
  const maps = await fetchAllMaps(worldUUID)
  return (
    <div className="flex flex-col gap-4">
      {maps.map((map) => (
        <MiniMapField key={map.map.id} mapImage={map.mapImage} map={map.map} />
      ))}
      <AddMapField key={maps.length} worldUUID={worldUUID} />
    </div>
  )
}
