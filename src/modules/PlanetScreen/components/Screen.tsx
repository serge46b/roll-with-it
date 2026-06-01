import { PLANET_GRADIENTS } from "../constants/Gradients"
import PlanetMainMenu from "./Planet"
import BgImage from "./BgImage"

const PLANET_BG_PLACEHOLDER =
  "radial-gradient(70% 70% at 66% 56%, rgba(255, 173, 109, 0.3) 0%, rgba(171, 98, 61, 0.26) 34%, rgba(74, 42, 37, 0.22) 52%, rgba(20, 15, 36, 0) 72%), radial-gradient(34% 34% at 53% 52%, rgba(255, 205, 236, 0.76) 0%, rgba(224, 120, 232, 0.62) 22%, rgba(144, 77, 183, 0.45) 43%, rgba(67, 40, 108, 0.24) 62%, rgba(15, 10, 33, 0) 78%), radial-gradient(120% 120% at 50% 50%, rgba(52, 35, 77, 0.42) 0%, rgba(17, 14, 37, 0.8) 56%, rgba(6, 8, 24, 1) 100%), linear-gradient(140deg, #090b23 0%, #110f2d 42%, #1c1637 68%, #2f2030 100%)"

export default function PlanetScreen() {
  return (
    <div
      className="relative min-h-[calc(100vh-48px)] w-full overflow-hidden"
      style={{ background: PLANET_BG_PLACEHOLDER }}
    >
      <BgImage />
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
