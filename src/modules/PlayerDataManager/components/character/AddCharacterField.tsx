"use client"

import { AddItemPlaceholder } from "../AddItemPlaceholder"
import { useCharacterCreateModal } from "./CharacterCreateModal"

export default function AddCharacterField() {
  const { openCreateModal } = useCharacterCreateModal()

  return <AddItemPlaceholder label="Создать персонажа" onClick={() => openCreateModal()} />
}
