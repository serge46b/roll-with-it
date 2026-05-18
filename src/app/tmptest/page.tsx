import { MenuBlock } from "@/components/MenuBlock"
import { Side } from "@/shared/types/SideEnum"
import { CharacterPanel, GmNotesList, NpcsList, SpellsList, WeaponsList } from "@/modules/PlayerDataManager"
import { TEST_CHARACTER_ID, TEST_WORLD_UUID, TmpTestProviders } from "./TmpTestProviders"

export default function TmpTestPage() {
  return (
    <TmpTestProviders>
      <div className="flex min-h-screen flex-col bg-neutral-900 p-4">
        <h1 className="text-lg text-white">PlayerDataManager — тест</h1>
        <div className="mt-auto flex flex-wrap gap-4">
          <MenuBlock titleContent="P" stickSide={Side.BOTTOM}>
            <CharacterPanel worldUUID={TEST_WORLD_UUID} />
          </MenuBlock>
          <MenuBlock titleContent="W" stickSide={Side.BOTTOM}>
            <WeaponsList characterId={TEST_CHARACTER_ID} />
          </MenuBlock>
          <MenuBlock titleContent="S" stickSide={Side.BOTTOM}>
            <SpellsList characterId={TEST_CHARACTER_ID} />
          </MenuBlock>
          <MenuBlock titleContent="N" stickSide={Side.BOTTOM}>
            <GmNotesList worldUUID={TEST_WORLD_UUID} />
          </MenuBlock>
          <MenuBlock titleContent="M" stickSide={Side.BOTTOM}>
            <NpcsList worldUUID={TEST_WORLD_UUID} />
          </MenuBlock>
        </div>
      </div>
    </TmpTestProviders>
  )
}
