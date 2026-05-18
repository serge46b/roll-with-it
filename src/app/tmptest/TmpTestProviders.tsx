// "use client"

import CharacterDataContextProvider from "@/shared/stores/CharacterDataStore"
import WorldDataContextProvider from "@/shared/stores/WorldDataStore"
import { CharacterCreateModalProvider, PlayerDataModalContextProvider } from "@/modules/PlayerDataManager"

export const TEST_WORLD_UUID = "1f15cc67-e53b-60d0-bb0f-72694ce2d375"
export const TEST_CHARACTER_ID = 2

export function TmpTestProviders({ children }: { children: React.ReactNode }) {
  return (
    <WorldDataContextProvider worldUUID={TEST_WORLD_UUID}>
      <CharacterDataContextProvider characterId={TEST_CHARACTER_ID}>
        <CharacterCreateModalProvider>
          <PlayerDataModalContextProvider>{children}</PlayerDataModalContextProvider>
        </CharacterCreateModalProvider>
      </CharacterDataContextProvider>
    </WorldDataContextProvider>
  )
}
