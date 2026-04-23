import { PLANET_GRADIENTS } from "../constants/Gradients"
import PlanetMainMenu from "./Planet"

// Это оставлено, чтобы потом если что вернуть приоритетную загрузку на изображение космоса
// const BackgroundImage = () => {
//   return (
//     <div className="absolute inset-0">
//       <Image src="/top100/2.jpeg" alt="Background" fill priority className="object-cover" />
//       <div className="absolute inset-0 bg-black/60" />
//     </div>
//   )
// }

export default function PlanetScreen() {
  return (
    <div className="relative min-h-[calc(100vh-48px)] w-full overflow-hidden bg-[url('/top100/2.jpeg')] bg-cover bg-center bg-no-repeat">
      <PlanetMainMenu
        className="absolute top-[25%] left-[20%] w-[20%] text-[26px]"
        backgroundImage={PLANET_GRADIENTS[0]}
        title="ПЛАНЕТА 1"
        createdAt="24 Apr 2026"
      />
      <PlanetMainMenu
        className="absolute top-[15%] left-[52%] w-[12%] text-[20px]"
        backgroundImage={PLANET_GRADIENTS[1]}
        title="ПЛАНЕТА 2"
        createdAt="24 Apr 2026"
      />
      <PlanetMainMenu
        className="absolute top-[60%] left-[44%] w-[8%] text-[16px]"
        backgroundImage={PLANET_GRADIENTS[2]}
        title="ПЛАНЕТА 3"
        showAdd
      />
      <PlanetMainMenu
        className="absolute top-[40%] left-[65%] w-[15%] text-[16px]"
        backgroundImage={PLANET_GRADIENTS[3]}
        title="ПЛАНЕТА 4"
        showAdd
      />
    </div>
  )
}
