import Image from "next/image";

const COLORS = {
  header: "bg-[#050709]",
};

const PLANET_GRADIENTS = [
  [
    "radial-gradient(120% 120% at 20% 100%, #fc9e44 0%, rgba(249, 242, 224, 0) 45%)",
    "radial-gradient(120% 120% at 88% 82%, #640d16 0%, #640d1500 58%)",
    "radial-gradient(130% 120% at 72% 78%, #a3541c 0%, #a3541c00 55%)",
    "radial-gradient(140% 135% at 34% 24%, #a86731 0%, #a8673100 62%)",
    "repeating-linear-gradient(46deg, rgba(252, 158, 68, 0.16) 0 10px, rgba(216, 151, 61, 0.16) 10px 20px, rgba(100, 13, 22, 0.18) 20px 30px)",
    "radial-gradient(120% 85% at 30% 36%, rgba(209, 185, 157, 0.97) 0%, rgba(232, 195, 153, 0) 62%)",
    "radial-gradient(circle at 55% 45%, #d8973d 0%, #e8c399 44%, #da8524 72%, #ecc074 100%)",
  ].join(", "),
  [
    "radial-gradient(115% 115% at 22% 18%, #f4e6c9 0%, #f4e6c900 48%)",
    "radial-gradient(120% 120% at 82% 72%,rgba(201, 166, 26, 0.69) 0%, #1e4f9100 58%)",
    "radial-gradient(130% 125% at 38% 82%, #cfb899 0%, #cfb89900 55%)",
    "repeating-radial-gradient(circle at 62% 36%, rgba(244, 230, 201, 0.16) 0 4px, rgba(207, 184, 153, 0.18) 4px 9px, rgba(103, 115, 131, 0.15) 9px 14px)",
    "repeating-linear-gradient(154deg, rgba(6, 19, 49, 0.14) 0 8px, rgba(131, 121, 103, 0.12) 8px 15px, rgba(30, 79, 145, 0.12) 15px 23px)",
    "radial-gradient(circle at 52% 48%, #677383 0%,rgb(131, 121, 103) 42%,rgb(32, 59, 117) 74%,rgb(6, 19, 49) 100%)",
  ].join(", "),
  [
    "radial-gradient(115% 115% at 18% 78%,rgb(179, 184, 139) 0%, #c084fc00 50%)",
    "radial-gradient(125% 120% at 88% 24%,rgb(121, 128, 68) 0%, rgba(216, 194, 125, 0) 56%)",
    "radial-gradient(120% 120% at 65% 86%,rgba(153, 220, 174, 0.83) 0%, rgba(87, 204, 124, 0) 58%)",
    "repeating-linear-gradient(168deg, rgba(245, 208, 254, 0.16) 0 7px, rgba(126, 34, 206, 0.18) 7px 14px, rgba(30, 27, 75, 0.16) 14px 22px)",
    "radial-gradient(circle at 50% 48%,rgb(208, 254, 223) 0%,rgb(52, 182, 128) 38%,rgb(34, 206, 140) 70%,rgb(27, 45, 75) 100%)",
  ].join(", "),
  ["radial-gradient(ellipse 90% 70% at 20% 90%, rgb(66, 34, 79) 0%,rgba(66, 34, 79, 0) 75%)",
    "radial-gradient(ellipse 90% 70% at 80% 50%,rgb(54, 50, 103) 0%,rgba(54, 50, 103, 0) 75%)",
    "radial-gradient(95% 80% at 72% 30%, rgba(54, 50, 103, 0.36) 0%, rgba(54, 50, 103, 0) 62%)",
    "repeating-radial-gradient(ellipse 30% 40% at 34% 100%, rgba(66, 34, 79, 0.2) 0 4px, rgba(146, 102, 203, 0.14) 4px 9px, rgba(54, 50, 103, 0.18) 9px 14px)",
    "radial-gradient(circle at 30% 40%, rgb(163, 195, 239) 0%,rgba(66, 133, 215, 0.5) 50%,rgb(146, 102, 203) 100%)",
  ].join(", ")
];


const DEFAULT_BACKGROUND_BLUR = PLANET_GRADIENTS[0];

const DEFAULT_SHADOW = `
  inset 4px 8px 10px rgba(255, 255, 255, 0.3),
  inset -6px -10px 24px rgba(22, 19, 22, 0.35),
  inset 0 0 0 1px rgba(22, 19, 22, 0.3),
  0 0 32px rgba(22, 19, 22, 0.7)
`;

interface PlanetMainMenuProps {
  className?: string;
  backgroundImage?: string;
  shadow?: string;
  title?: string;
  createdAt?: string;
  showAdd?: boolean;
}


export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <BackgroundLayer />
      <div className="relative min-h-screen w-full">
        <Header />
        <PlanetMainMenu className="absolute left-[10%] top-[180px] w-[380px] text-[26px]" backgroundImage={PLANET_GRADIENTS[0]} title="ПЛАНЕТА 1" createdAt="24 Apr 2026" />
        <PlanetMainMenu className="absolute left-[52%] top-[-300px] w-[220px] text-[20px]" backgroundImage={PLANET_GRADIENTS[1]} title="ПЛАНЕТА 2" createdAt="24 Apr 2026" />
        <PlanetMainMenu className="absolute left-[44%] top-[-100px] w-[160px] text-[16px]" backgroundImage={PLANET_GRADIENTS[2]} showAdd />
        <PlanetMainMenu className="absolute left-[70%] top-[-450px] w-[260px] text-[16px]" backgroundImage={PLANET_GRADIENTS[3]} showAdd />
      </div>
    </div>
  );
}

const BackgroundLayer = () => {
  return (
    <div className="absolute inset-0">
      <Image src="/top100/2.jpeg" alt="Background" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
};

const Header = () => {
  return (
    <header className={`flex items-center justify-between absolute top-0 left-0 w-full h-12 ${COLORS.header}`}>
      <div className="relative w-8 h-8 rounded-[10%] border border-white ml-[2%] my-2 p-1">
        <Image src="/svgs/logo.svg" alt="Logo" fill className="object-contain p-1" />
      </div>
      <div className="items-center justify-center flex gap-4 mr-[2%]">
        <p className="text-white text-1xl border-r border-white pr-4 font-roboto">ВОЙТИ</p>
        <p className="text-white text-1xl font-roboto">ЗАРЕГИСТРИРОВАТЬСЯ</p>
      </div>
    </header>
  );
}

function PlanetMainMenu({
  className,
  backgroundImage = DEFAULT_BACKGROUND_BLUR,
  shadow = DEFAULT_SHADOW,
  title = "No name given",
  createdAt = "Unknown date",
  showAdd: showAddIcon = false,
}: PlanetMainMenuProps) {
  return (
    <div
      className={`relative aspect-square rounded-full ${className ?? ""}`}
      style={{
        backgroundImage,
        border: "1px solid rgba(22, 19, 22, 0.3)",
        boxShadow: shadow,
      }}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-white">
        {showAddIcon ? (
          <p className="text-[64px] leading-none font-light text-white/85">+</p>
        ) : (
          <div className="flex w-[220px] flex-col items-center text-center">
            <p className="whitespace-nowrap font-semibold leading-none tracking-[0.05em]">{title}</p>
            <p className="mt-2 whitespace-nowrap text-[16px] leading-none tracking-[0.05em] text-white/85">{createdAt}</p>
          </div>
        )}
      </div>
    </div>
  );
}
