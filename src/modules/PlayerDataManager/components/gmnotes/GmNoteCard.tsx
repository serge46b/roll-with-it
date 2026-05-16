"use client"

import { useTransition } from "react"
import type { GmNoteCardData } from "../../types/PlayerDataTypes"
import { usePlayerDataModal } from "../PlayerDataModalContext"

interface GmNoteCardProps {
  data: GmNoteCardData
  className?: string
}

export function GmNoteCard({ data, className }: GmNoteCardProps) {
  const { openModal } = usePlayerDataModal()
  const [isEditPending, startEditTransition] = useTransition()

  return (
    <article
      className={`relative w-full rounded-[0.35em] border border-white/30 bg-black/50 p-[0.85em] text-[length:1em] text-white ${className ?? ""}`}
    >
      <button
        type="button"
        className={`absolute top-[0.4em] right-[0.4em] rounded-md bg-white/50 px-2 py-1 text-[0.7em] text-black ${isEditPending ? "animate-pulse" : ""}`}
        onClick={() => {
          startEditTransition(async () => {
            await openModal({ kind: "gmNote", id: data.id })
          })
        }}
      >
        Edit
      </button>
      <p className="whitespace-pre-wrap pr-[3em] text-[0.75em] leading-relaxed uppercase tracking-wide text-white/80">
        {data.note}
      </p>
    </article>
  )
}
