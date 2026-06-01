interface AddItemPlaceholderProps {
  className?: string
  onClick?: () => void
  label?: string
}

export function AddItemPlaceholder({ className, onClick, label = "Добавить" }: AddItemPlaceholderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[3.5em] w-full cursor-pointer items-center justify-center rounded-[0.45em] border border-dashed border-white/35 bg-transparent text-[length:1em] text-white/70 transition-colors hover:border-white/60 hover:text-white ${className ?? ""}`}
      aria-label={label}
    >
      <span className="text-[2em] leading-none">+</span>
    </button>
  )
}
