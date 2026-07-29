"use client";

import { useEffect, useId, useRef, useState } from "react";

const ENERGY_PATH =
  "M -20 105 C 100 105, 120 45, 250 45 S 420 105, 620 55";

const NODE_POSITIONS = [0.25, 0.5, 0.75];

type Point = {
  x: number;
  y: number;
};

type GameCardEnergyProps = {
  active: boolean;
};

export function GameCardEnergy({ active }: GameCardEnergyProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [nodePoints, setNodePoints] = useState<Point[]>([]);

  // Prevent duplicate SVG filter IDs when multiple cards are rendered.
  const filterId = useId().replaceAll(":", "");

  useEffect(() => {
    const path = pathRef.current;

    if (!path) {
      return;
    }

    const totalLength = path.getTotalLength();

    const points = NODE_POSITIONS.map((position) => {
      const point = path.getPointAtLength(totalLength * position);

      return {
        x: point.x,
        y: point.y,
      };
    });

    setNodePoints(points);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-16 h-32 overflow-hidden"
    >
      <svg
        viewBox="0 0 600 140"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <filter
            id={filterId}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="4" result="blur" />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Faint line that is always visible */}
        <path
          ref={pathRef}
          d={ENERGY_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-border"
        />

        {/* Active product-coloured line */}
        <path
          d={ENERGY_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength="1"
          filter={active ? `url(#${filterId})` : undefined}
          className={[
            "text-primary transition-[opacity,stroke-dashoffset] duration-700 ease-out",
            "[stroke-dasharray:1]",
            active
              ? "opacity-100 [stroke-dashoffset:0]"
              : "opacity-0 [stroke-dashoffset:1]",
          ].join(" ")}
        />

        {nodePoints.map((point, index) => (
          <EnergyNode
            key={NODE_POSITIONS[index]}
            x={point.x}
            y={point.y}
            active={active}
            delay={`${index * 100}ms`}
          />
        ))}
      </svg>
    </div>
  );
}

type EnergyNodeProps = {
  x: number;
  y: number;
  active: boolean;
  delay: string;
};

function EnergyNode({ x, y, active, delay }: EnergyNodeProps) {
  return (
    <g
      style={{
        transformOrigin: `${x}px ${y}px`,
        transitionDelay: delay,
      }}
      className={[
        "text-primary transition-[opacity,transform] duration-500",
        active ? "scale-100 opacity-100" : "scale-75 opacity-30",
      ].join(" ")}
    >
      <circle
        cx={x}
        cy={y}
        r="9"
        fill="currentColor"
        className={active ? "opacity-15" : "opacity-0"}
      />

      <circle cx={x} cy={y} r="3.5" fill="currentColor" />
    </g>
  );
}