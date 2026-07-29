// src/components/home/HeroEnergyLine.tsx

export function HeroEnergyLine() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0 text-brand"
    >
      <svg
        viewBox="0 0 1440 700"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient
            id="hero-energy-gradient"
            x1="0"
            y1="1"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="45%" stopColor="currentColor" stopOpacity="0.14" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        <path
          d="M -80 610 C 260 590, 440 660, 690 500 S 1040 170, 1510 210"
          fill="none"
          stroke="url(#hero-energy-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-primary"
        />

        <path
          d="M -80 625 C 280 600, 460 680, 710 515 S 1060 190, 1510 230"
          fill="none"
          stroke="url(#hero-energy-gradient)"
          strokeWidth="1"
          strokeLinecap="round"
          className="text-primary opacity-60"
        />
      </svg>
    </div>
  );
}