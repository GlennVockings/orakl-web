import { cn } from "@/lib/utils";

type EnergyLineProps = {
  className?: string;
};

const nodes = [
  { x: 170, y: 280 },
  { x: 360, y: 205 },
  { x: 565, y: 245 },
  { x: 745, y: 145 },
  { x: 955, y: 190 },
  { x: 1160, y: 90 },
] as const;

export function EnergyLine({ className }: EnergyLineProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full",
        className,
      )}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 420"
    >
      <path
        d="
          M -50 340
          C 40 340, 90 300, 170 280
          S 285 190, 360 205
          S 485 285, 565 245
          S 675 165, 745 145
          S 875 205, 955 190
          S 1085 105, 1160 90
          S 1240 60, 1280 45
        "
        stroke="currentColor"
        strokeOpacity="0.38"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />

      <path
        d="
          M -50 370
          C 120 330, 205 385, 340 315
          S 555 320, 690 255
          S 920 290, 1035 220
          S 1190 210, 1280 165
        "
        stroke="currentColor"
        strokeOpacity="0.14"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />

      {nodes.map(({ x, y }, index) => {
        const isPrimaryNode = index === 2;

        return (
          <g key={`${x}-${y}`}>
            {isPrimaryNode && (
              <circle
                cx={x}
                cy={y}
                fill="currentColor"
                fillOpacity="0.1"
                r="15"
              />
            )}

            <circle
              cx={x}
              cy={y}
              fill="currentColor"
              fillOpacity={isPrimaryNode ? "1" : "0.72"}
              r={isPrimaryNode ? "5" : "4"}
            />
          </g>
        );
      })}
    </svg>
  );
}