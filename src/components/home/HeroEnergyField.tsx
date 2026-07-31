"use client";

import { useId } from "react";

type HeroEnergyFieldProps = {
  className?: string;
};

type EnergyLine = {
  path: string;
  alternatePath: string;
  duration: number;
  delay: number;
  opacity: number;
  width: number;
};

const ENERGY_LINES: EnergyLine[] = [
  {
    path: "M -120 120 C 80 30, 220 210, 420 115 S 760 20, 1040 125 S 1320 220, 1640 95",
    alternatePath:
      "M -120 105 C 70 185, 230 20, 430 125 S 760 210, 1030 90 S 1340 15, 1640 130",
    duration: 18,
    delay: -4,
    opacity: 0.14,
    width: 1.2,
  },
  {
    path: "M -160 205 C 40 110, 240 280, 470 175 S 820 80, 1080 190 S 1380 275, 1660 155",
    alternatePath:
      "M -160 185 C 65 270, 255 95, 465 205 S 815 285, 1095 165 S 1375 75, 1660 195",
    duration: 23,
    delay: -11,
    opacity: 0.1,
    width: 1,
  },
  {
    path: "M -100 300 C 100 205, 275 385, 500 280 S 850 185, 1110 295 S 1385 375, 1650 255",
    alternatePath:
      "M -100 275 C 95 365, 280 190, 500 305 S 850 390, 1110 265 S 1390 175, 1650 300",
    duration: 27,
    delay: -17,
    opacity: 0.08,
    width: 1,
  },
  {
    path: "M -180 400 C 30 305, 230 475, 455 370 S 820 275, 1080 390 S 1380 465, 1680 350",
    alternatePath:
      "M -180 370 C 40 455, 235 290, 465 405 S 815 480, 1090 360 S 1380 265, 1680 405",
    duration: 21,
    delay: -8,
    opacity: 0.12,
    width: 1.1,
  },
  {
    path: "M -130 505 C 90 405, 275 590, 520 475 S 860 390, 1130 500 S 1400 580, 1660 460",
    alternatePath:
      "M -130 475 C 85 565, 285 395, 510 515 S 865 590, 1130 470 S 1405 375, 1660 510",
    duration: 25,
    delay: -15,
    opacity: 0.07,
    width: 0.9,
  },
  {
    path: "M -170 610 C 40 510, 240 690, 475 580 S 820 490, 1100 605 S 1390 685, 1680 565",
    alternatePath:
      "M -170 580 C 50 670, 245 500, 480 620 S 825 695, 1100 575 S 1390 480, 1680 615",
    duration: 30,
    delay: -21,
    opacity: 0.06,
    width: 0.9,
  },
];

export function HeroEnergyField({
    className = "",
}: HeroEnergyFieldProps) {
    const uniqueId = useId().replace(/:/g, "");
    const glowId = `hero-energy-glow-${uniqueId}`;

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      ].join(" ")}
    >
      <svg
        className="hero-energy-field h-full w-full text-primary"
        viewBox="0 0 1440 720"
        preserveAspectRatio="none"
      >
        <defs>
          <filter
            id={glowId}
            x="-20%"
            y="-50%"
            width="140%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="2.5"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

          {ENERGY_LINES.map((line, index) => (
            <path
              key={index}
              d={line.path}
              fill="none"
              stroke="currentColor"
              strokeWidth={line.width}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={line.opacity}
              filter={`url(#${glowId})`}
            >
            <animate
              attributeName="d"
              values={[
                line.path,
                line.alternatePath,
                line.path,
              ].join(";")}
              dur={`${line.duration}s`}
              begin={`${line.delay}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines={[
                "0.45 0 0.55 1",
                "0.45 0 0.55 1",
              ].join(";")}
            />
          </path>
        ))}
      </svg>
    </div>
  );
}