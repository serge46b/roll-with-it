"use client"

import { usePlayerDataModal } from "../PlayerDataModalContext"
import { AddItemPlaceholder } from "../AddItemPlaceholder"

export default function AddGmNoteField() {
  const { openModal } = usePlayerDataModal()

  return <AddItemPlaceholder label="Добавить записку" onClick={() => openModal({ kind: "gmNote" })} />
}
