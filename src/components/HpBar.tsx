interface HpBarProps {
  maxHp: number
  currentHp: number
  className?: string
}

const WHITE_SKEW = "1em"
const RED_SKEW = "0.8em"

export function HpBar({ maxHp, currentHp, className }: HpBarProps) {
  const safeMax = maxHp > 0 ? maxHp : 1
  const fillPercent = `${Math.min(100, Math.max(0, (currentHp / safeMax) * 100))}%`

  return (
    <div className={`relative h-[1.5em] w-full min-w-0 ${className ?? ""}`}>
      <div
        className="absolute inset-0 bg-white"
        style={{
          clipPath: `polygon(0 0, calc(100% - ${WHITE_SKEW}) 0, 100% 100%, ${WHITE_SKEW} 100%)`,
        }}
      />
      <div className="absolute inset-y-[0.15em] left-[0.35em] right-[0.35em]">
        <div
          className="h-full bg-[#c92b2f]"
          style={{
            width: fillPercent,
            clipPath: `polygon(0 0, calc(100% - ${RED_SKEW}) 0, 100% 100%, ${RED_SKEW} 100%)`,
          }}
        />
      </div>
    </div>
  )
}
