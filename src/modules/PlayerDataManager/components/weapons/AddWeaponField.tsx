"use client"

import { usePlayerDataModal } from "../PlayerDataModalContext"
import { AddItemPlaceholder } from "../AddItemPlaceholder"

export default function AddWeaponField() {
  const { openModal } = usePlayerDataModal()

  return <AddItemPlaceholder label="Добавить оружие" onClick={() => openModal({ kind: "weapon" })} />
}
