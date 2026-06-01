"use client"

import { UserWorldCardData } from "../api/fetchers"
import { PLANET_GRADIENTS } from "../constants/Gradients"
import BgImage from "./BgImage"
import Planet from "./Planet"
import { WorldAddModalContext } from "./WorldAddModalContext"
import { useContext } from "react"
import { useRouter } from "next/navigation"

const PLANET_POSITIONS = [
  "absolute top-[25%] left-[20%] w-[20%] text-[26px]",
  "absolute top-[15%] left-[52%] w-[12%] text-[20px]",
  "absolute top-[60%] left-[44%] w-[8%] text-[16px]",
  "absolute top-[40%] left-[65%] w-[15%] text-[16px]",
]

// export default function PlanetScreen({ worlds }: { worlds: UserWorldCardData[] }) {
//   const { openModal } = useContext(WorldAddModalContext)
//   const [localWorldsArray, setLocalWorldsArray] = useState<{ planetIndex: number; worldUUID: string }[]>([])
//   useEffect(() => {
//     const localWorlds = localStorage.getItem(WORLD_PLANET_STORAGE_KEY)
//     console.log(localWorlds, JSON.parse(localWorlds ?? "[]"))
//     let localWorldsArrayInner: { planetIndex: number; worldUUID: string }[] = JSON.parse(localWorlds ?? "[]")
//     console.log(localWorldsArrayInner)
//     // if (localWorldsArrayInner.length === 0) {
//     //   localWorldsArrayInner = worlds.map((world, index) => ({ planetIndex: index, worldUUID: world.uuid }))
//     //   localStorage.setItem(WORLD_PLANET_STORAGE_KEY, JSON.stringify(localWorldsArrayInner))
//     // }
//     setLocalWorldsArray([...localWorldsArrayInner])
//   }, [worlds])
//   return (
//     <div className="relative min-h-[calc(100vh-48px)] w-full overflow-hidden">
//       <BgImage />
//       {localWorldsArray.map((world, index) => {
//         if (index >= 4) return <></>
//         const worldData = worlds.find((worldData) => worldData.uuid == world.worldUUID)
//         return (
//           <Planet
//             key={world.worldUUID}
//             className={PLANET_POSITIONS[world.planetIndex]}
//             backgroundImage={PLANET_GRADIENTS[world.planetIndex]}
//             title={worldData?.name}
//             createdAt={worldData?.createdAt}
//             onClick={() => {
//               redirect(`/world/${world.worldUUID}`)
//             }}
//             showAdd={false}
//           />
//         )
//       })}
//       {Array.from({ length: 4 - localWorldsArray.length }).map((_, index) => {
//         const trueIndex = index + localWorldsArray.length
//         console.log(trueIndex)
//         return (
//           <Planet
//             key={trueIndex}
//             className={PLANET_POSITIONS[trueIndex]}
//             backgroundImage={PLANET_GRADIENTS[trueIndex]}
//             onClick={() => {
//               console.log(trueIndex)
//               openModal(trueIndex)
//             }}
//             showAdd={true}
//           />
//         )
//       })}
//     </div>
//   )
// }

export default function PlanetScreen({ worlds }: { worlds: UserWorldCardData[] }) {
  const { openModal } = useContext(WorldAddModalContext)
  const router = useRouter()
  return (
    <div className="relative min-h-[calc(100vh-48px)] w-full overflow-hidden">
      <BgImage />
      {worlds.map((world, index) => {
        if (index >= 4) return <></>
        return (
          <Planet
            key={world.uuid}
            className={PLANET_POSITIONS[index]}
            backgroundImage={PLANET_GRADIENTS[index]}
            title={world.name}
            createdAt={world.createdAt}
            onClick={() => {
              router.push(`/world/${world.uuid}`)
            }}
            showAdd={false}
          />
        )
      })}
      {worlds.length < 4 &&
        Array.from({ length: 4 - worlds.length }).map((_, index) => {
          const trueIndex = index + worlds.length
          return (
            <Planet
              key={trueIndex}
              className={PLANET_POSITIONS[trueIndex]}
              backgroundImage={PLANET_GRADIENTS[trueIndex]}
              onClick={() => {
                openModal(trueIndex)
              }}
              showAdd={true}
            />
          )
        })}
    </div>
  )
}
