"use client"

import { createContext, useContext, useState, useTransition } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { useRouter } from "next/navigation"
import { StyledModal } from "@/components/StyledModal"
import { FileUploadField } from "@/components/FileUploadField"
import { prepareImage, type PreparedImage } from "@/modules/MapManager/helpers/PrepareImage"
import { useWorldData } from "@/shared/stores/WorldDataStore"
import { createPlayerCharacter } from "../../api/updaters"
import { panelInputClass, panelLabelClass, panelTextareaClass } from "../formStyles"
import type { PlayerCharacterFormValues } from "../../types/PlayerDataTypes"

interface CharacterCreateModalContextInterface {
  openCreateModal: () => void
  closeCreateModal: () => void
}

const CharacterCreateModalContext = createContext<CharacterCreateModalContextInterface>({
  openCreateModal: () => {},
  closeCreateModal: () => {},
})

const CharacterCreateDialogHandler = Dialog.createHandle()

const EMPTY_PLAYER_CHARACTER: PlayerCharacterFormValues = {
  name: "",
  class: "",
  race: "",
  level: 1,
  currentHp: 10,
  maxHp: 10,
  hpBonus: 0,
  defenseClass: 10,
  speed: 30,
  alignment: "",
  backgroundStory: "",
  accentColor: "#888888",
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className={panelLabelClass}>{label}</span>
      {children}
    </label>
  )
}

export function CharacterCreateModalProvider({ children }: { children: React.ReactNode }) {
  const worldUUID = useWorldData()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<PlayerCharacterFormValues>(EMPTY_PLAYER_CHARACTER)
  const [image, setImage] = useState<PreparedImage | null>(null)

  const resetForm = () => {
    setError(null)
    setForm(EMPTY_PLAYER_CHARACTER)
    setImage(null)
  }

  const closeCreateModal = () => {
    CharacterCreateDialogHandler.close()
    router.refresh()
  }

  const openCreateModal = () => {
    resetForm()
    CharacterCreateDialogHandler.open("context-trigger")
  }

  const handleSave = () => {
    setError(null)
    startTransition(async () => {
      try {
        await createPlayerCharacter(worldUUID, form, image ?? undefined)
        closeCreateModal()
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : String(saveError))
      }
    })
  }

  const updateForm = <K extends keyof PlayerCharacterFormValues>(key: K, value: PlayerCharacterFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <>
      <CharacterCreateModalContext.Provider value={{ openCreateModal, closeCreateModal }}>
        {children}
      </CharacterCreateModalContext.Provider>
      <StyledModal handle={CharacterCreateDialogHandler}>
        <div className="flex max-h-[85vh] w-[min(90vw,32rem)] flex-col gap-4 overflow-y-auto p-8 text-white">
          <Dialog.Title>Создать персонажа</Dialog.Title>

          <div className="flex flex-col gap-3">
            <FormField label="Имя">
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Арагорн"
                className={panelInputClass}
              />
            </FormField>

            <div className="grid grid-cols-3 gap-3">
              <FormField label="Класс">
                <input
                  type="text"
                  value={form.class}
                  onChange={(event) => updateForm("class", event.target.value)}
                  placeholder="Воин"
                  className={panelInputClass}
                />
              </FormField>
              <FormField label="Раса">
                <input
                  type="text"
                  value={form.race}
                  onChange={(event) => updateForm("race", event.target.value)}
                  placeholder="Человек"
                  className={panelInputClass}
                />
              </FormField>
              <FormField label="Уровень">
                <input
                  type="number"
                  value={form.level}
                  onChange={(event) => updateForm("level", Number(event.target.value))}
                  className={panelInputClass}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Текущее HP">
                <input
                  type="number"
                  value={form.currentHp}
                  onChange={(event) => updateForm("currentHp", Number(event.target.value))}
                  className={panelInputClass}
                />
              </FormField>
              <FormField label="Максимальное HP">
                <input
                  type="number"
                  value={form.maxHp}
                  onChange={(event) => updateForm("maxHp", Number(event.target.value))}
                  className={panelInputClass}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FormField label="Класс защиты">
                <input
                  type="number"
                  value={form.defenseClass}
                  onChange={(event) => updateForm("defenseClass", Number(event.target.value))}
                  className={panelInputClass}
                />
              </FormField>
              <FormField label="Скорость">
                <input
                  type="number"
                  value={form.speed}
                  onChange={(event) => updateForm("speed", Number(event.target.value))}
                  className={panelInputClass}
                />
              </FormField>
              <FormField label="Бонус HP">
                <input
                  type="number"
                  value={form.hpBonus}
                  onChange={(event) => updateForm("hpBonus", Number(event.target.value))}
                  className={panelInputClass}
                />
              </FormField>
            </div>

            <FormField label="Мировоззение">
              <input
                type="text"
                value={form.alignment}
                onChange={(event) => updateForm("alignment", event.target.value)}
                placeholder="Нейтральный-добрый"
                className={panelInputClass}
              />
            </FormField>

            <FormField label="Цвет акцента">
              <input
                type="color"
                value={form.accentColor}
                onChange={(event) => updateForm("accentColor", event.target.value)}
                className="h-10 w-full cursor-pointer border border-white/40 bg-black/30"
              />
            </FormField>

            <FormField label="История">
              <textarea
                value={form.backgroundStory}
                onChange={(event) => updateForm("backgroundStory", event.target.value)}
                placeholder="Предыстория персонажа..."
                className={panelTextareaClass}
              />
            </FormField>

            <FormField label="Аватар (необязательно)">
              <FileUploadField
                onFileSet={async (file) => {
                  if (!file) {
                    setImage(null)
                    return
                  }
                  setImage(await prepareImage(file))
                }}
                accept="image/*"
                placeholder="Загрузить изображение"
                inline
              />
            </FormField>
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex justify-between gap-4">
            <button type="button" disabled={isPending} onClick={closeCreateModal} className="cursor-pointer px-4 py-2">
              Отмена
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleSave}
              className="cursor-pointer rounded border border-white/40 px-4 py-2 hover:bg-white/10"
            >
              {isPending ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </StyledModal>
    </>
  )
}

export function useCharacterCreateModal() {
  return useContext(CharacterCreateModalContext)
}
