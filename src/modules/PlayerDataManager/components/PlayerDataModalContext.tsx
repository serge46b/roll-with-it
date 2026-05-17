"use client"

import { createContext, useContext, useState, useTransition } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { useRouter } from "next/navigation"
import { createClient } from "@/shared/supabase/client"
import { StyledModal } from "@/components/StyledModal"
import { FileUploadField } from "@/components/FileUploadField"
import { prepareImage, type PreparedImage } from "@/modules/MapManager/helpers/PrepareImage"
import { useWorldData } from "@/shared/stores/WorldDataStore"
import { useCharacterData } from "@/shared/stores/CharacterDataStore"
import {
  fetchCharacterById,
  fetchGmNoteById,
  fetchSpellById,
  fetchWeaponByEquipmentItemId,
} from "../api/fetchers"
import {
  createCharacter,
  createGmNote,
  createSpell,
  createWeapon,
  updateCharacter,
  updateGmNote,
  updateSpell,
  updateWeapon,
  uploadCharacterAvatar,
} from "../api/updaters"
import { panelInputClass, panelLabelClass, panelTextareaClass } from "./formStyles"
import type {
  GmNoteFormValues,
  NpcFormValues,
  SpellFormValues,
  WeaponFormValues,
} from "../types/PlayerDataTypes"

export type PlayerDataModalOpen =
  | { kind: "weapon"; equipmentItemId?: number }
  | { kind: "spell"; id?: number }
  | { kind: "gmNote"; id?: number }
  | { kind: "npc"; id?: number; image?: PreparedImage }

interface PlayerDataModalContextInterface {
  openModal: (params: PlayerDataModalOpen) => Promise<void>
  closeModal: () => void
}

export const PlayerDataModalContext = createContext<PlayerDataModalContextInterface>({
  openModal: () => Promise.resolve(),
  closeModal: () => {},
})

const PlayerDataDialogHandler = Dialog.createHandle()

const EMPTY_WEAPON: WeaponFormValues = {
  name: "",
  attackBonus: "",
  damage: "",
  type: "",
  description: "",
}

const EMPTY_SPELL: SpellFormValues = {
  name: "",
  level: "",
  description: "",
}

const EMPTY_GM_NOTE: GmNoteFormValues = {
  note: "",
}

const EMPTY_NPC: NpcFormValues = {
  name: "",
  currentHp: 10,
  maxHp: 10,
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

export default function PlayerDataModalContextProvider({ children }: { children: React.ReactNode }) {
  const worldUUID = useWorldData()
  const characterId = useCharacterData()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [activeKind, setActiveKind] = useState<PlayerDataModalOpen["kind"] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [weaponEquipmentItemId, setWeaponEquipmentItemId] = useState<number | null>(null)
  const [weaponForm, setWeaponForm] = useState<WeaponFormValues>(EMPTY_WEAPON)

  const [spellId, setSpellId] = useState<number | null>(null)
  const [spellForm, setSpellForm] = useState<SpellFormValues>(EMPTY_SPELL)

  const [gmNoteId, setGmNoteId] = useState<number | null>(null)
  const [gmNoteForm, setGmNoteForm] = useState<GmNoteFormValues>(EMPTY_GM_NOTE)

  const [npcId, setNpcId] = useState<number | null>(null)
  const [npcForm, setNpcForm] = useState<NpcFormValues>(EMPTY_NPC)
  const [npcImage, setNpcImage] = useState<PreparedImage | null>(null)

  const resetState = () => {
    setError(null)
    setWeaponEquipmentItemId(null)
    setWeaponForm(EMPTY_WEAPON)
    setSpellId(null)
    setSpellForm(EMPTY_SPELL)
    setGmNoteId(null)
    setGmNoteForm(EMPTY_GM_NOTE)
    setNpcId(null)
    setNpcForm(EMPTY_NPC)
    setNpcImage(null)
  }

  const closeModal = () => {
    PlayerDataDialogHandler.close()
    router.refresh()
  }

  const openModal = async (params: PlayerDataModalOpen) => {
    resetState()
    setActiveKind(params.kind)

    if (params.kind === "weapon") {
      setWeaponEquipmentItemId(params.equipmentItemId ?? null)
      if (params.equipmentItemId) {
        const weapon = await fetchWeaponByEquipmentItemId(params.equipmentItemId)
        if (weapon) {
          setWeaponForm({
            name: weapon.name,
            attackBonus: weapon.attackBonus,
            damage: weapon.damage,
            type: weapon.type,
            description: weapon.description,
          })
        }
      } else {
        setWeaponForm(EMPTY_WEAPON)
      }
      PlayerDataDialogHandler.open("context-trigger")
      return
    }

    if (params.kind === "spell") {
      setSpellId(params.id ?? null)
      if (params.id) {
        const spell = await fetchSpellById(params.id)
        if (spell) {
          setSpellForm({
            name: spell.name,
            level: String(spell.level),
            description: spell.description,
          })
        }
      } else {
        setSpellForm(EMPTY_SPELL)
      }
      PlayerDataDialogHandler.open("context-trigger")
      return
    }

    if (params.kind === "gmNote") {
      if (params.id) {
        const note = await fetchGmNoteById(params.id)
        if (note) {
          setGmNoteId(note.id)
          setGmNoteForm({ note: note.note })
        }
      }
      PlayerDataDialogHandler.open("context-trigger")
      return
    }

    if (params.kind === "npc") {
      if (params.id) {
        const npc = await fetchCharacterById(params.id)
        if (npc) {
          setNpcId(npc.id)
          setNpcForm({
            name: npc.name,
            currentHp: npc.currentHp,
            maxHp: npc.maxHp,
            accentColor: npc.accentColor,
          })
        }
      } else if (params.image) {
        setNpcImage(params.image)
      }
      PlayerDataDialogHandler.open("context-trigger")
    }
  }

  const handleSave = () => {
    setError(null)
    startTransition(async () => {
      try {
        if (activeKind === "weapon") {
          if (weaponEquipmentItemId) {
            await updateWeapon(weaponEquipmentItemId, weaponForm)
          } else {
            await createWeapon(characterId, weaponForm)
          }
          closeModal()
          return
        }

        if (activeKind === "spell") {
          if (spellId) {
            await updateSpell(spellId, characterId, spellForm)
          } else {
            await createSpell(characterId, spellForm)
          }
          closeModal()
          return
        }

        if (activeKind === "gmNote") {
          if (gmNoteId) {
            await updateGmNote(gmNoteId, gmNoteForm)
          } else {
            await createGmNote(worldUUID, gmNoteForm)
          }
          closeModal()
          return
        }

        if (activeKind === "npc") {
          if (npcId) {
            await updateCharacter(npcId, npcForm)
          } else {
            const newId = await createCharacter(worldUUID, npcForm)
            if (npcImage) {
              const supabase = createClient()
              const {
                data: { user },
              } = await supabase.auth.getUser()
              if (user) {
                await uploadCharacterAvatar(user.id, newId, npcImage)
              }
            }
          }
          closeModal()
        }
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : String(saveError))
      }
    })
  }

  const modalTitle = (() => {
    switch (activeKind) {
      case "weapon":
        return weaponEquipmentItemId ? "Редактировать оружие" : "Добавить оружие"
      case "spell":
        return spellId ? "Редактировать заклинание" : "Добавить заклинание"
      case "gmNote":
        return gmNoteId ? "Редактировать записку" : "Добавить записку"
      case "npc":
        return npcId ? "Редактировать персонажа" : "Добавить персонажа"
      default:
        return ""
    }
  })()

  return (
    <>
      <PlayerDataModalContext.Provider value={{ openModal, closeModal }}>{children}</PlayerDataModalContext.Provider>
      <StyledModal handle={PlayerDataDialogHandler}>
        <div className="flex max-h-[85vh] w-[min(90vw,32rem)] flex-col gap-4 overflow-y-auto p-8 text-white">
          <Dialog.Title>{modalTitle}</Dialog.Title>

          {activeKind === "weapon" ? (
            <div className="flex flex-col gap-3">
              <FormField label="Название">
                <input
                  type="text"
                  value={weaponForm.name}
                  onChange={(e) => setWeaponForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Меч пламени"
                  className={panelInputClass}
                />
              </FormField>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Бонус атаки">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={weaponForm.attackBonus}
                    onChange={(e) => setWeaponForm((prev) => ({ ...prev, attackBonus: e.target.value }))}
                    placeholder="+5"
                    className={panelInputClass}
                  />
                </FormField>
                <FormField label="Урон">
                  <input
                    type="text"
                    value={weaponForm.damage}
                    onChange={(e) => setWeaponForm((prev) => ({ ...prev, damage: e.target.value }))}
                    placeholder="1d8+3"
                    className={panelInputClass}
                  />
                </FormField>
                <FormField label="Вид">
                  <input
                    type="text"
                    value={weaponForm.type}
                    onChange={(e) => setWeaponForm((prev) => ({ ...prev, type: e.target.value }))}
                    placeholder="Рубящий"
                    className={panelInputClass}
                  />
                </FormField>
              </div>
              <FormField label="Описание">
                <textarea
                  value={weaponForm.description}
                  onChange={(e) => setWeaponForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Свойства, особенности, заметки..."
                  className={panelTextareaClass}
                />
              </FormField>
            </div>
          ) : null}

          {activeKind === "spell" ? (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-[minmax(0,1fr)_3.75rem] items-end gap-3">
                <FormField label="Название">
                  <input
                    type="text"
                    value={spellForm.name}
                    onChange={(e) => setSpellForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Огненный шар"
                    className={panelInputClass}
                  />
                </FormField>
                <FormField label="Уровень">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={spellForm.level}
                    onChange={(e) => setSpellForm((prev) => ({ ...prev, level: e.target.value }))}
                    placeholder="3"
                    className={panelInputClass}
                  />
                </FormField>
              </div>
              <FormField label="Описание">
                <textarea
                  value={spellForm.description}
                  onChange={(e) => setSpellForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Эффект, условия, дополнительные детали..."
                  className={panelTextareaClass}
                />
              </FormField>
            </div>
          ) : null}

          {activeKind === "gmNote" ? (
            <FormField label="Записка">
              <textarea
                value={gmNoteForm.note}
                onChange={(e) => setGmNoteForm({ note: e.target.value })}
                placeholder="Текст записки для мастера..."
                className={panelTextareaClass}
              />
            </FormField>
          ) : null}

          {activeKind === "npc" ? (
            <div className="flex flex-col gap-3">
              <FormField label="Имя">
                <input
                  type="text"
                  value={npcForm.name}
                  onChange={(e) => setNpcForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Гоблин"
                  className={panelInputClass}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Текущее HP">
                  <input
                    type="number"
                    value={npcForm.currentHp}
                    onChange={(e) => setNpcForm((prev) => ({ ...prev, currentHp: Number(e.target.value) }))}
                    className={panelInputClass}
                  />
                </FormField>
                <FormField label="Максимальное HP">
                  <input
                    type="number"
                    value={npcForm.maxHp}
                    onChange={(e) => setNpcForm((prev) => ({ ...prev, maxHp: Number(e.target.value) }))}
                    className={panelInputClass}
                  />
                </FormField>
              </div>
              <FormField label="Цвет акцента">
                <input
                  type="color"
                  value={npcForm.accentColor}
                  onChange={(e) => setNpcForm((prev) => ({ ...prev, accentColor: e.target.value }))}
                  className="h-10 w-full cursor-pointer border border-white/40 bg-black/30"
                />
              </FormField>
              {!npcId ? (
                <FormField label="Аватар (необязательно)">
                  <FileUploadField
                    onFileSet={async (file) => {
                      if (!file) {
                        setNpcImage(null)
                        return
                      }
                      setNpcImage(await prepareImage(file))
                    }}
                    accept="image/*"
                    placeholder="Загрузить изображение"
                    inline
                  />
                </FormField>
              ) : null}
            </div>
          ) : null}

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex justify-between gap-4">
            <button type="button" disabled={isPending} onClick={closeModal} className="cursor-pointer px-4 py-2">
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

export function usePlayerDataModal() {
  return useContext(PlayerDataModalContext)
}
