"use client"

import { createContext, useRef, useState, useTransition, useContext } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { StyledModal } from "@/components/StyledModal"
import { useRouter } from "next/navigation"
import twclsx from "@/shared/utils/twClassMerge"
import {
  panelInputClass,
  panelLabelClass,
  panelTextareaClass,
} from "@/modules/PlayerDataManager/components/formStyles"
import { createWorld } from "../api/updaters"

const PANEL_BUTTON_CLASS =
  "h-11 min-w-36 rounded-md border border-white/70 bg-[#1b1b1b]/40 px-6 text-sm font-light tracking-[0.12em] text-white uppercase transition-colors hover:border-white hover:bg-[#1b1b1b]/60 disabled:cursor-not-allowed disabled:opacity-60"

const CHOICE_BUTTON_CLASS =
  "flex h-[clamp(7rem,16vh,9rem)] min-w-0 flex-1 cursor-pointer flex-col items-center justify-center rounded-md border border-white/70 bg-[#1b1b1b]/40 px-3 text-center text-xl font-light leading-snug tracking-wide text-white transition-colors hover:border-white hover:bg-[#1b1b1b]/60"

interface WorldAddModalContextInterface {
  openModal: (planetIndex: number) => Promise<void>
  closeModal: () => void
}

export const WorldAddModalContext = createContext<WorldAddModalContextInterface>({
  openModal: () => Promise.resolve(),
  closeModal: () => {},
})

const WorldAddDialogHandler = Dialog.createHandle()

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className={panelLabelClass}>{label}</span>
      {children}
    </label>
  )
}

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
      <StyledModal handle={WorldAddDialogHandler} initialFocus={false}>
        <div
          className={twclsx(
            "flex flex-col gap-4 bg-[#1b1b1b]/15 text-white backdrop-blur-[4px]",
            modalMode === null ? "w-[min(92vw,32rem)] p-4 sm:p-5" : "w-[min(92vw,42rem)] p-6 sm:p-8",
          )}
        >
          {modalMode === "create" && (
            <CreateWorldModalContent
              isPending={isPending}
              onBack={() => {
                setError(null)
                setModalMode(null)
              }}
              onCreate={(worldName, worldDescription) => {
                startTransition(async () => {
                  setError(null)
                  try {
                    const worldUUID = await createWorld(worldName, worldDescription)
                    if (!worldUUID) {
                      setError("Не удалось создать мир")
                      return
                    }
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
              onBack={() => {
                setError(null)
                setModalMode(null)
              }}
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
                startTransition(() => {
                  closeModal()
                  router.push(`/world/${worldLink}`)
                })
              }}
            />
          )}
          {modalMode === null && <ChooseWorldAddModalContent onChoose={setModalMode} />}
          {error && <p className="text-sm text-red-300">{error}</p>}
        </div>
      </StyledModal>
    </>
  )
}

function CreateWorldModalContent({
  onCreate,
  onBack,
  isPending,
}: {
  onCreate: (worldName: string, worldDescription: string) => void
  onBack: () => void
  isPending: boolean
}) {
  const wroldNameInputRef = useRef<HTMLInputElement>(null)
  const wroldDescriptionTextareaRef = useRef<HTMLTextAreaElement>(null)
  return (
    <div className="flex flex-col gap-4">
      <Dialog.Title className="text-center text-xl font-light tracking-wide">Создать мир</Dialog.Title>
      <FormField label="Название мира">
        <input
          type="text"
          placeholder="Название мира"
          ref={wroldNameInputRef}
          className={panelInputClass}
        />
      </FormField>
      <FormField label="Описание">
        <textarea
          placeholder="Описание мира"
          ref={wroldDescriptionTextareaRef}
          rows={5}
          className={panelTextareaClass}
        />
      </FormField>
      <div className="mt-2 flex items-center justify-between gap-3">
        <button type="button" className={PANEL_BUTTON_CLASS} disabled={isPending} onClick={onBack}>
          Назад
        </button>
        <button
          type="button"
          className={PANEL_BUTTON_CLASS}
          disabled={isPending}
          onClick={() =>
            onCreate(wroldNameInputRef.current?.value ?? "", wroldDescriptionTextareaRef.current?.value ?? "")
          }
        >
          {isPending ? "Создание..." : "Создать"}
        </button>
      </div>
    </div>
  )
}

function ConnectWorldModalContent({
  onConnect,
  onBack,
  isPending,
}: {
  onConnect: (worldLink: string) => void
  onBack: () => void
  isPending: boolean
}) {
  const worldLinkInputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="flex flex-col gap-4">
      <Dialog.Title className="text-center text-xl font-light tracking-wide">Подключиться к миру</Dialog.Title>
      <FormField label="UUID мира">
        <input
          type="text"
          placeholder="00000000-0000-0000-0000-000000000000"
          ref={worldLinkInputRef}
          className={panelInputClass}
        />
      </FormField>
      <div className="mt-2 flex items-center justify-between gap-3">
        <button type="button" className={PANEL_BUTTON_CLASS} disabled={isPending} onClick={onBack}>
          Назад
        </button>
        <button
          type="button"
          className={PANEL_BUTTON_CLASS}
          disabled={isPending}
          onClick={() => onConnect(worldLinkInputRef.current?.value ?? "")}
        >
          {isPending ? "Подключение..." : "Подключиться"}
        </button>
      </div>
    </div>
  )
}

function ChooseWorldAddModalContent({ onChoose }: { onChoose: (mode: "create" | "connect") => void }) {
  return (
    <div className="flex w-full flex-row gap-3">
      <button type="button" className={CHOICE_BUTTON_CLASS} onClick={() => onChoose("create")}>
        Создать мир
      </button>
      <button type="button" className={CHOICE_BUTTON_CLASS} onClick={() => onChoose("connect")}>
        Подключиться к миру
      </button>
    </div>
  )
}
