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
const PANEL_INPUT_CLASS =
  "h-11 w-full rounded-md border border-white/80 bg-[#1b1b1b]/40 px-4 py-2 text-base font-light tracking-wide text-white placeholder:text-white/50 outline-none transition-colors focus:border-white"
const PANEL_LABEL_CLASS = "text-xs font-light tracking-wide text-white/80 uppercase"
const PANEL_BUTTON_CLASS =
  "h-11 min-w-36 rounded-md border border-white/70 bg-[#1b1b1b]/40 px-6 text-sm font-light tracking-[0.12em] text-white uppercase transition-colors hover:border-white hover:bg-[#1b1b1b]/60 disabled:cursor-not-allowed disabled:opacity-60"
const RANGE_CLASS =
  "h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-[#8b5cf6] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/60 [&::-webkit-slider-thumb]:bg-[#8b5cf6] [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(0,0,0,0.35)] [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-white/15 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-white/60 [&::-moz-range-thumb]:bg-[#8b5cf6]"

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
      throw new Error("Изображение карты не найдено")
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
        <div className="w-[min(92vw,42rem)] bg-[#1b1b1b]/15 p-6 backdrop-blur-[4px] sm:p-8">
          {initialImage || existingMap ? (
            <div className="relative h-[clamp(13rem,32vh,20rem)] w-full overflow-hidden rounded-md border border-white/60 bg-black/30">
              <MapDisplay
                mapImage={existingMap ? existingMap.mapImageURL : (initialImage!.image.src ?? "")}
                imageWidth={existingMap ? existingMap.mapImageWidth : initialImage!.width}
                imageHeight={existingMap ? existingMap.mapImageHeight : initialImage!.height}
                gridSize={gridSize}
              />
            </div>
          ) : (
            <p className="text-sm text-red-300">Ошибка загрузки изображения</p>
          )}
          <div className="mt-4 flex flex-col gap-2">
            <p className={PANEL_LABEL_CLASS}>Размер сетки: {gridSize}</p>
            <input
              type="range"
              min={10}
              max={100}
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className={RANGE_CLASS}
            />
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <label className={PANEL_LABEL_CLASS} htmlFor="map-name-input">
              Название карты
            </label>
            <input
              id="map-name-input"
              ref={inputRef}
              defaultValue={existingMap ? existingMap.mapName : ""}
              type="text"
              placeholder="Карта без названия"
              className={PANEL_INPUT_CLASS}
            />
          </div>
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button className={PANEL_BUTTON_CLASS} disabled={isUploadPending} onClick={closeModal}>
              Отмена
            </button>
            <button
              className={PANEL_BUTTON_CLASS}
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
              {isUploadPending ? "Сохранение..." : "Сохранено"}
            </button>
          </div>
        </div>
      </StyledModal>
    </>
  )
}
