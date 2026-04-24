"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Dise, FunBlocks } from "@/components/components"

const COLORS = {
  header: "bg-[#050709]",
}

export default function PlayMaster() {
  //Сетка
  const [grid, setGrid] = useState({
    isShow: true, //Скрыть/показать сетку
    opacity: 0.5, //Прозрачность сетки
    size: 64, //Размер сетки
    isSettingsOpen: false, //Открыть/закрыть настройки сетки
    position: { x: 0, y: 0 }, //Положение сетки
  })

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* <BackgroundLayer /> */}
      {/* <Grid grid={grid} />
            {grid.isShow && grid.isSettingsOpen && (
                <GridMoveHandle grid={grid} setGrid={setGrid} />
            )} */}
      {/* <Header /> */}
      {/* <SetupToGrid grid={grid} setGrid={setGrid} /> */}
      <div className="fixed bottom-0 z-20 box-border flex w-full flex-row items-end justify-center space-x-[2.5rem] px-[2rem]">
        <Dise />
        <FunBlocks text="Карты" />
        <FunBlocks text="Игроки" />
        <FunBlocks text="Существа" />
        <FunBlocks text="Заметки" />
      </div>
    </div>
  )
}
