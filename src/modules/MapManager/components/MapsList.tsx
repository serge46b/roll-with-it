import { fetchAllMaps } from "../api/fetchers"
import AddMapField from "./MapEdit/AddMapField"
import MapEditModalContextProvider from "./MapEdit/MapEditModalContext"
import MiniMapField from "./MapEdit/MiniMapField"

export default async function MapsList({ worldUUID }: { worldUUID: string }) {
  const maps = await fetchAllMaps(worldUUID)
  return (
    <div className="flex flex-col gap-4">
      <MapEditModalContextProvider>
        {maps.map((map) => (
          <MiniMapField key={map.map.id} mapImage={map.mapImage} map={map.map} />
        ))}
        <AddMapField key={maps.length} />
      </MapEditModalContextProvider>
    </div>
  )
}
