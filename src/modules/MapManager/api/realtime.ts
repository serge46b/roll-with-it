"use client"

import { createClient } from "@/shared/supabase/client"
import { Character } from "@/shared/types/dbSchema"

export function subscribeToTokenChanges(tokenId: number, listener: (newData: Character) => void) {
  const supabase = createClient()
  const channelName = `token_${tokenId}_coords`
  let cancelled = false
  let cleanup = () => {}

  void (async () => {
    const existing = supabase.getChannels().find((channel) => channel.topic === `realtime:${channelName}`)
    if (existing) {
      await supabase.removeChannel(existing)
    }
    if (cancelled) return

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (cancelled) return

    if (session?.access_token) {
      await supabase.realtime.setAuth(session.access_token)
    }
    if (cancelled) return

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "character", filter: `id=eq.${tokenId}` },
        (payload) => {
          const newData = payload.new as Character
          listener(newData)
        },
      )
      .subscribe()

    cleanup = () => {
      void supabase.removeChannel(channel)
    }

    if (cancelled) {
      cleanup()
    }
  })()

  return () => {
    cancelled = true
    cleanup()
  }
}
