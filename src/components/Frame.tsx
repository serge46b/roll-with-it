export function ActionPanelFrame({ className = "" , width, height }: { className?: string , width: number, height: number }) {
    return (
      <svg
        className={`absolute h-[${height}px] w-[${width}px] ${className}`}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="presentation"
        aria-hidden="true"
      >
        <path
          d="M348.153 2C350.146 28.1935 371.542 48.9614 398 49.9619V448.037C370.872 449.063 349.064 470.872 348.038 498H51.9619C50.936 470.872 29.1284 449.063 2 448.037V51.9619C29.1284 50.936 50.936 29.1284 51.9619 2H348.153Z"
          fill="none"
          stroke="white"
          strokeWidth={4}
          strokeLinejoin="miter"
        />
      </svg>
    );
  }