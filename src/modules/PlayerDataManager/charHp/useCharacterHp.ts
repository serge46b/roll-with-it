"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { updateCharacterCurrentHp } from "../api/updaters"

const HP_SAVE_DEBOUNCE_MS = 400

interface UseCharacterHpOptions {
  characterId: number
  currentHp: number
  maxHp: number
  canEditHp: boolean
}

export function useCharacterHp({ characterId, currentHp, maxHp, canEditHp }: UseCharacterHpOptions) {
  const router = useRouter()
  const [hp, setHp] = useState(currentHp)
  const [isSaving, setIsSaving] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingHpRef = useRef<number | null>(null)

  useEffect(() => {
    setHp(currentHp)
  }, [currentHp])

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const persistHp = useCallback(
    async (value: number) => {
      setIsSaving(true)
      try {
        await updateCharacterCurrentHp(characterId, value)
        router.refresh()
      } finally {
        setIsSaving(false)
        pendingHpRef.current = null
      }
    },
    [characterId, router],
  )

  const handleHpChange = (newValue: number) => {
    if (!canEditHp || isSaving) {
      return
    }

    const clamped = Math.min(maxHp, Math.max(0, newValue))
    setHp(clamped)
    pendingHpRef.current = clamped

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      const valueToSave = pendingHpRef.current
      if (valueToSave === null) {
        return
      }
      void persistHp(valueToSave)
    }, HP_SAVE_DEBOUNCE_MS)
  }

  return { hp, handleHpChange, isPending: isSaving }
}
