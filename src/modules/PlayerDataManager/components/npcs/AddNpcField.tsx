"use client"

import { usePlayerDataModal } from "../PlayerDataModalContext"
import { AddItemPlaceholder } from "../AddItemPlaceholder"

export default function AddNpcField() {
  const { openModal } = usePlayerDataModal()

  return <AddItemPlaceholder label="Добавить персонажа" onClick={() => openModal({ kind: "npc" })} />
}
