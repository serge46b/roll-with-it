"use client"

import { usePlayerDataModal } from "../PlayerDataModalContext"
import { AddItemPlaceholder } from "../AddItemPlaceholder"

export default function AddSpellField() {
  const { openModal } = usePlayerDataModal()

  return <AddItemPlaceholder label="Добавить заклинание" onClick={() => openModal({ kind: "spell" })} />
}
