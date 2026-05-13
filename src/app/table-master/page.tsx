// "use client"
import { DraggingToken, MapDisplay } from "@/modules/MapManager"
// import { fetchTokenData } from "@/modules/MapManager/api/fetchers"
import { MovingToken } from "@/modules/MapManager"
import { createClient } from "@/shared/supabase/server"
// import MapEditModalContextProvider from "@/modules/MapManager/components/MapEdit/MapEditModalContext"
import { fetchMapData, fetchMapImage, fetchTokenImage } from "@/modules/MapManager/api/fetchers"
import { Tables } from "@/shared/supabase/dbSchema"

// import AddMapField from "@/modules/MapManager/components/MapEdit/AddMapField"
// import MapEditModalContextProvider from "@/modules/MapManager/components/MapEdit/MapEditModalContext"
// import MapsList from "@/modules/MapManager/components/MapsList"
// import WorldDataContextProvider, { WorldDataContext } from "@/shared/stores/WorldDataStore"

export default async function TableMaster() {
  // Fetch tokens owned by current user (owner = user.uid)
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw new Error(userError.message)
  }

  let ownedTokens = []
  if (user) {
    const { data: tokensData, error: tokensError } = await supabase.from("character").select("*").eq("owner", user.id)

    if (tokensError) {
      throw new Error(tokensError.message)
    }
    ownedTokens = tokensData || []
  }
  let notOwnedData: Tables<"character"> | null = null
  if (!ownedTokens.some((token: { id: number }) => token.id === 2)) {
    const { data: notOwnedDataResult, error: notOwnedError } = await supabase
      .from("character")
      .select("*")
      .eq("id", 2)
      .single()
    if (notOwnedError) {
      throw new Error(notOwnedError.message)
    }
    notOwnedData = notOwnedDataResult || null
  }
  console.log(ownedTokens.some((token: { id: number }) => token.id === 2))
  const mapImage = await fetchMapImage("1f15cc67-e53b-60d0-bb0f-72694ce2d375", 13)
  if (!mapImage?.mapImageURL) {
    throw new Error("Map image not found")
  }
  const mapData = await fetchMapData("1f15cc67-e53b-60d0-bb0f-72694ce2d375", 13)
  if (!mapData) {
    throw new Error("Map data not found")
  }
  const tokenImage = await fetchTokenImage(2)
  if (!tokenImage) {
    console.log("Token image not found")
  }
  return (
    <div className="h-screen w-screen">
      <MapDisplay
        mapImage={mapImage.mapImageURL}
        imageWidth={mapImage.imageWidth}
        imageHeight={mapImage.imageHeight}
        gridSize={mapData.grid_scale_px}
        mapName={mapData.name}
      >
        {ownedTokens.some((token: { id: number }) => token.id === 2) ? (
          <DraggingToken
            data={ownedTokens.find((token: { id: number }) => token.id === 2)}
            gridSize={mapData.grid_scale_px}
          />
        ) : (
          <MovingToken data={notOwnedData} gridSize={mapData.grid_scale_px} />
        )}
      </MapDisplay>
    </div>
  )
}

// export default function TableMaster() {
//   return (
//     <div className="flex h-screen w-1/5 flex-col p-4">
//       <WorldDataContextProvider worldUUID="1f15cc67-e53b-60d0-bb0f-72694ce2d375">
//         <MapEditModalContextProvider>
//           {/* <AddMapField worldUUID="1f15cc67-e53b-60d0-bb0f-72694ce2d375" /> */}
//           <MapsList worldUUID="1f15cc67-e53b-60d0-bb0f-72694ce2d375" />
//         </MapEditModalContextProvider>
//       </WorldDataContextProvider>
//     </div>
//   )
// }
