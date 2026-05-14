"use client"

import { createContext, useRef, useState, useTransition, useContext } from "react"
import { PreparedImage } from "../../helpers/PrepareImage"
import { Dialog } from "@base-ui/react/dialog"
import { StyledModal } from "@/components/StyledModal"
import MapDisplay from "../MapDisplay/MapDisplay"
import { updateMapData, uploadMapImage } from "../../api/updaters"
import { fetchMapData, fetchMapImage } from "../../api/fetchers"
import { useRouter } from "next/navigation"
import { useWorldData } from "@/shared/stores/WorldDataStore"

const DEFAULT_GRID_SIZE = 10

interface ExistingMap {
  mapId: number
  mapName: string
  mapImageURL: string
  mapImageWidth: number
  mapImageHeight: number
}

interface MapEditModalContextInterface {
  openModal: (map: { id?: number; image?: PreparedImage }) => Promise<void>
  closeModal: () => void
}

export const MapEditModalContext = createContext<MapEditModalContextInterface>({
  openModal: () => Promise.resolve(),
  closeModal: () => {},
})

const MapEditDialogHandler = Dialog.createHandle()

export default function MapEditModalContextProvider({ children }: { children: React.ReactNode }) {
  const [isUploadPending, startUploadTransition] = useTransition()
  const worldUUID = useWorldData()
  if (!worldUUID) {
    throw new Error("MapEditModalContextProvider should be wrapped in WorldDataContextProvider")
  }
  const router = useRouter()
  const [mapId, setMapId] = useState<number | null>(null)
  const [initialImage, setInitialImage] = useState<PreparedImage | null>(null)
  const [existingMap, setExistingMap] = useState<ExistingMap | null>(null)

  const [gridSize, setGridSize] = useState<number>(DEFAULT_GRID_SIZE)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const openModal = async (map: { id?: number; image?: PreparedImage }) => {
    setInitialImage(null)
    setExistingMap(null)
    setError(null)
    setGridSize(DEFAULT_GRID_SIZE)
    setMapId(map.id ?? null)
    if (!map.id) {
      setInitialImage(map.image ?? null)
      MapEditDialogHandler.open("context-trigger")
      return
    }
    console.log("Requesting map data")
    const [mapData, mapImage] = await Promise.all([fetchMapData(worldUUID, map.id), fetchMapImage(worldUUID, map.id)])
    if (!mapImage?.mapImageURL) {
      throw new Error("Map image not found")
    }
    setExistingMap({
      mapId: mapData.id,
      mapName: mapData.name,
      mapImageURL: mapImage.mapImageURL,
      mapImageWidth: mapImage.imageWidth,
      mapImageHeight: mapImage.imageHeight,
    })
    setGridSize(mapData.grid_scale_px)
    MapEditDialogHandler.open("context-trigger")
  }
  const closeModal = () => {
    MapEditDialogHandler.close()
    router.refresh()
  }
  return (
    <>
      <MapEditModalContext.Provider value={{ openModal, closeModal }}>{children}</MapEditModalContext.Provider>
      <StyledModal handle={MapEditDialogHandler}>
        <div className="flex flex-col gap-4 p-8">
          <Dialog.Title>Map Edit</Dialog.Title>
          {initialImage || existingMap ? (
            <div className="h-[50vh] w-[70vw] border border-white">
              <MapDisplay
                mapImage={existingMap ? existingMap.mapImageURL : (initialImage!.image.src ?? "")}
                imageWidth={existingMap ? existingMap.mapImageWidth : initialImage!.width}
                imageHeight={existingMap ? existingMap.mapImageHeight : initialImage!.height}
                gridSize={gridSize}
              />
            </div>
          ) : (
            <p>Error while loading image</p>
          )}
          <div className="flex flex-col gap-4">
            <p>Grid Size: {gridSize}</p>
            <input
              type="range"
              min={10}
              max={100}
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
            />
          </div>
          <input
            ref={inputRef}
            defaultValue={existingMap ? existingMap.mapName : ""}
            type="text"
            placeholder="Map Name"
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-between">
            <button disabled={isUploadPending} onClick={closeModal}>
              Cancel
            </button>
            <button
              disabled={isUploadPending}
              onClick={() => {
                setError(null)
                startUploadTransition(async () => {
                  if (!worldUUID) {
                    setError("Что-то пошло не так (WorldUUID unset error)")
                    return
                  }
                  const mapName = inputRef.current?.value ?? "Безымянная карта"
                  if (!mapId) {
                    if (!initialImage) {
                      setError("Что-то пошло не так (image load error)")
                      return
                    }
                    try {
                      await uploadMapImage(worldUUID, mapName, initialImage, gridSize)
                      closeModal()
                    } catch (error) {
                      setError(`Ошибка загрузки карты (${error})`)
                    }
                    return
                  }
                  if (existingMap) {
                    await updateMapData(existingMap.mapId, mapName, gridSize)
                    closeModal()
                  }
                })
              }}
            >
              {isUploadPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </StyledModal>
    </>
  )
}
