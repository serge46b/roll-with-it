"use client"

import { createContext, useRef, useState, useTransition, useContext } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { Frame, StyledModal } from "@/components/StyledModal"
import { useRouter } from "next/navigation"
import { createWorld } from "../api/updaters"

interface WorldAddModalContextInterface {
  openModal: (planetIndex: number) => Promise<void>
  closeModal: () => void
}

export const WorldAddModalContext = createContext<WorldAddModalContextInterface>({
  openModal: () => Promise.resolve(),
  closeModal: () => {},
})

const WorldAddDialogHandler = Dialog.createHandle()

export default function WorldAddModalContextProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [planetIndex, setPlanetIndex] = useState<number | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "connect" | null>(null)
  const router = useRouter()
  const openModal = async (planetIndex: number) => {
    setModalMode(null)
    setError(null)
    setPlanetIndex(planetIndex)
    WorldAddDialogHandler.open("context-trigger")
  }
  const closeModal = () => {
    WorldAddDialogHandler.close()
  }

  return (
    <>
      <WorldAddModalContext.Provider value={{ openModal, closeModal }}>{children}</WorldAddModalContext.Provider>
      <StyledModal handle={WorldAddDialogHandler}>
        <div className="flex flex-col gap-4 p-8">
          {modalMode === "create" && (
            <CreateWorldModalContent
              isPending={isPending}
              onCreate={(worldName, worldDescription) => {
                startTransition(async () => {
                  setError(null)
                  try {
                    const worldUUID = await createWorld(worldName, worldDescription)
                    if (!worldUUID) {
                      setError("Не удалось создать мир")
                      return
                    }
                    // localStorage.setItem(
                    //   WORLD_PLANET_STORAGE_KEY,
                    //   JSON.stringify([
                    //     ...(JSON.parse(localStorage.getItem(WORLD_PLANET_STORAGE_KEY) ?? "[]") || []),
                    //     { planetIndex, worldUUID },
                    //   ]),
                    // )
                    closeModal()
                    router.push(`/world/${worldUUID}`)
                  } catch (error) {
                    setError(error instanceof Error ? error.message : String(error))
                  }
                })
              }}
            />
          )}
          {modalMode === "connect" && (
            <ConnectWorldModalContent
              isPending={isPending}
              onConnect={(worldLink) => {
                setError(null)
                if (!worldLink) {
                  setError("Введите ссылку на мир")
                  return
                }
                if (!worldLink.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
                  setError("Неверный формат ссылки на мир")
                  return
                }
                // localStorage.setItem(
                //   WORLD_PLANET_STORAGE_KEY,
                //   JSON.stringify([
                //     ...(JSON.parse(localStorage.getItem(WORLD_PLANET_STORAGE_KEY) ?? "[]") || []),
                //     { planetIndex, worldUUID: worldLink },
                //   ]),
                // )
                startTransition(() => {
                  closeModal()
                  router.push(`/world/${worldLink}`)
                })
              }}
            />
          )}
          {modalMode === null && <ChooseWorldAddModalContent onChoose={setModalMode} />}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </StyledModal>
    </>
  )
}

function CreateWorldModalContent({
  onCreate,
  isPending,
}: {
  onCreate: (worldName: string, worldDescription: string) => void
  isPending: boolean
}) {
  const wroldNameInputRef = useRef<HTMLInputElement>(null)
  const wroldDescriptionTextareaRef = useRef<HTMLTextAreaElement>(null)
  return (
    <>
      <Dialog.Title className="text-center">Создать мир</Dialog.Title>
      <input type="text" placeholder="Название мира" ref={wroldNameInputRef} />
      <textarea placeholder="Описание мира" ref={wroldDescriptionTextareaRef} />
      <button
        disabled={isPending}
        onClick={() =>
          onCreate(wroldNameInputRef.current?.value ?? "", wroldDescriptionTextareaRef.current?.value ?? "")
        }
      >
        {isPending ? "Создание..." : "Создать"}
      </button>
    </>
  )
}

function ConnectWorldModalContent({
  onConnect,
  isPending,
}: {
  onConnect: (worldLink: string) => void
  isPending: boolean
}) {
  const worldLinkInputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <Dialog.Title className="text-center">Подключиться к миру</Dialog.Title>
      <input type="text" placeholder="UUID мира" ref={worldLinkInputRef} />
      <button disabled={isPending} onClick={() => onConnect(worldLinkInputRef.current?.value ?? "")}>
        {isPending ? "Подключение..." : "Подключиться"}
      </button>
    </>
  )
}

function ChooseWorldAddModalContent({ onChoose }: { onChoose: (mode: "create" | "connect") => void }) {
  return (
    <div className="flex w-full gap-4">
      <div className="flex w-1/2 items-center justify-center border border-white">
        <button className="h-full w-full p-6 outline-none" onClick={() => onChoose("create")}>
          Создать мир
        </button>
      </div>
      <div className="flex w-1/2 items-center justify-center border border-white">
        <button className="h-full w-full p-6 outline-none" onClick={() => onChoose("connect")}>
          Подключиться к миру
        </button>
      </div>
    </div>
  )
}
