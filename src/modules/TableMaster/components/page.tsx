import {
  BlocksPole,
  ChatPole,
  Dise,
  Header,
  InterfaceHp,
  SmallInterfaceHp,
} from "@/components"

export default function PlayMaster() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      <Header />
      <ChatPole />
      <div className="fixed bottom-0 z-20 w-full overflow-x-auto px-2">
        <div className="mx-auto flex w-full min-w-0 max-w-full flex-row items-end justify-center gap-5">
          <Dise />
          <BlocksPole text="Карты" />
          <BlocksPole text="Игроки" />
          <BlocksPole text="Существа" />
          <BlocksPole text="Заметки" />
        </div>
      </div>
    </div>
  )
}
