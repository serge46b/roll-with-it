import { MenuBlock } from "@/components/MenuBlock"
import { DraggingToken, MovingToken } from "@/modules/MapManager"
import { fetchMapData, fetchMapImage, fetchTokenImage } from "@/modules/MapManager/"
import { MapDisplay } from "@/modules/MapManager/"
import { MapsList } from "@/modules/MapManager"
import { Tables } from "@/shared/supabase/dbSchema"
import { createClient } from "@/shared/supabase/server"
import { Side } from "@/shared/types/SideEnum"
import { User } from "@supabase/supabase-js"
import Image from "next/image"
import {
  CharacterCreateModalProvider,
  CharacterPanel,
  fetchPlayerCharacterByWorld,
  GmNotesList,
  NpcsList,
  SpellsList,
  WeaponsList,
} from "@/modules/PlayerDataManager"
import { DiceContent, RollDiceModalContextProvider } from "@/modules/Dice"
import WorldDataContextProvider from "@/shared/stores/WorldDataStore"
import PlayerDataModalContextProvider from "@/modules/PlayerDataManager/components/PlayerDataModalContext"
import CharacterDataContextProvider from "@/shared/stores/CharacterDataStore"
import { redirect } from "next/navigation"
import ShareWorld from "@/components/ShareWorldModal"

export default async function WorldPage({
  params,
  searchParams,
}: {
  params: { uid: string }
  searchParams: { mapId: string }
}) {
  const { uid } = await params
  const { mapId } = await searchParams
  let mapIdNumber = mapId ? parseInt(mapId) : null
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError) {
    if (userError.status === 401) {
      redirect("/login")
    }
    return <p className="text-red-500">Error: {userError.message}</p>
  }
  if (!user) {
    return <p className="text-red-500">User not found</p>
  }
  const { data: world, error: worldError } = await supabase.from("world").select("*").eq("uuid", uid).single()
  if (worldError) {
    return <p className="text-red-500">Error: {worldError.message}</p>
  }
  if (!world) {
    return <p className="text-red-500">World not found</p>
  }
  if (mapIdNumber === null) {
    const { data: mapsIds, error: mapsIdsError } = await supabase.from("map").select("id").eq("world", world.uuid)
    if (mapsIdsError) {
      return <p className="text-red-500">Error: {mapsIdsError.message}</p>
    }
    if (!mapsIds) {
      return <p className="text-red-500">Maps not found</p>
    }
    mapsIds.sort((a, b) => a.id - b.id)
    mapIdNumber = mapsIds.length > 0 ? mapsIds[0].id : null
  }
  const isUserOwner = world.owner === user.id
  return (
    <div className="relative h-[calc(100vh-3rem)] w-full overflow-hidden bg-[#1E1E1E]">
      <WorldDataContextProvider worldUUID={world.uuid}>
        {mapIdNumber && <WorldMap key={mapIdNumber} worldUUID={world.uuid} mapId={mapIdNumber} user={user} />}
        <BarMenu worldUUID={world.uuid} isOwner={isUserOwner} />
      </WorldDataContextProvider>
    </div>
  )
}

async function WorldMap({ worldUUID, mapId, user }: { worldUUID: string; mapId: number; user: User }) {
  const mapImage = await fetchMapImage(worldUUID, mapId)
  if (!mapImage?.mapImageURL) {
    return <p className="text-red-500">Map image not found</p>
  }
  const mapData = await fetchMapData(worldUUID, mapId)
  if (!mapData) {
    return <p className="text-red-500">Map data not found</p>
  }
  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapDisplay
        mapImage={mapImage.mapImageURL}
        imageWidth={mapImage.imageWidth}
        imageHeight={mapImage.imageHeight}
        gridSize={mapData.grid_scale_px}
        mapName={mapData.name}
      >
        <Tokens worldUUID={worldUUID} user={user} gridSize={mapData.grid_scale_px} />
      </MapDisplay>
    </div>
  )
}

async function Tokens({ worldUUID, user, gridSize }: { worldUUID: string; user: User; gridSize: number }) {
  const supabase = await createClient()
  const { data: tokens, error: tokensError } = await supabase.from("character").select("*").eq("world", worldUUID)
  if (tokensError) {
    return <p className="text-red-500">Error: {tokensError.message}</p>
  }
  const tokenImages = await Promise.all(tokens?.map((token: Tables<"character">) => fetchTokenImage(token.id)) || [])
  return tokens?.map((token: Tables<"character">, index) =>
    token.owner === user.id ? (
      <DraggingToken key={token.id} data={token} gridSize={gridSize} imageUrl={tokenImages[index]} />
    ) : (
      <MovingToken key={token.id} data={token} gridSize={gridSize} imageUrl={tokenImages[index]} />
    ),
  )
}

async function BarMenu({ worldUUID, isOwner }: { worldUUID: string; isOwner: boolean }) {
  let character
  try {
    character = await fetchPlayerCharacterByWorld(worldUUID)
  } catch (error) {
    if (!isOwner) {
      console.error(error)
      return <p className="text-red-500">Error: {(error as Error).message}</p>
    }
  }
  return (
    <div className="absolute bottom-0 left-0 flex w-full items-end justify-evenly">
      <div className="w-15">
        <RollDiceModalContextProvider>
          <MenuBlock
            titleContent={<Image src="/svgs/d20.svg" alt="Dice" width={24} height={24} />}
            stickSide={Side.BOTTOM}
          >
            <DiceContent />
          </MenuBlock>
        </RollDiceModalContextProvider>
      </div>
      {isOwner ? (
        <CharacterDataContextProvider characterId={-1}>
          <PlayerDataModalContextProvider>
            <MenuBlock titleContent="Карты" stickSide={Side.BOTTOM}>
              <MapsList worldUUID={worldUUID} />
            </MenuBlock>
            <MenuBlock titleContent="Персонажи" stickSide={Side.BOTTOM}>
              <NpcsList worldUUID={worldUUID} />
            </MenuBlock>
            <MenuBlock titleContent="Заметки" stickSide={Side.BOTTOM}>
              <GmNotesList worldUUID={worldUUID} />
            </MenuBlock>
            <ShareWorld worldUUID={worldUUID} />
          </PlayerDataModalContextProvider>
        </CharacterDataContextProvider>
      ) : (
        <>
          <CharacterCreateModalProvider>
            <MenuBlock titleContent="Персонаж" stickSide={Side.BOTTOM}>
              <CharacterPanel worldUUID={worldUUID} />
            </MenuBlock>
          </CharacterCreateModalProvider>
          {character && (
            <CharacterDataContextProvider characterId={character.id}>
              <PlayerDataModalContextProvider>
                <MenuBlock titleContent="Предметы" stickSide={Side.BOTTOM}>
                  <WeaponsList characterId={character.id} />
                </MenuBlock>
                <MenuBlock titleContent="Заклинания" stickSide={Side.BOTTOM}>
                  <SpellsList characterId={character.id} />
                </MenuBlock>
              </PlayerDataModalContextProvider>
            </CharacterDataContextProvider>
          )}
        </>
      )}
    </div>
  )
}
