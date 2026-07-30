"use client"

import { useEffect, useId, useRef, useState } from "react";

type GameCardEnergyProps = {
    active: boolean;
};

type Point = {
    x: number;
    y: number;
};

const ENERGY_PATH =
    "M -20 78 C 100 78, 120 30, 250 30 S 420 78, 620 38";

const NODE_POSITIONS = [0.25, 0.5, 0.75];

const PULSE_DURATION = "1.1s";

export default function GameCardEnergy({
    active,
}: GameCardEnergyProps) {
    const pathRef = useRef<SVGPathElement>(null);

    const [nodePoints, setNodePoints] = useState<Point[]>([]);

    const uniqueId = useId().replace(/:/g, "");
    const pathId = `game-card-energy-path-${uniqueId}`;
    const glowId = `game-card-energy-glow-${uniqueId}`;

    useEffect(() => {
        const path = pathRef.current;

        if (!path) {
            return;
        }

        const totalLength = path.getTotalLength();

        const points = NODE_POSITIONS.map((position) => {
            const point = path.getPointAtLength(
                totalLength * position
            );

            return {
                x: point.x,
                y: point.y,
            };
        });

        setNodePoints(points);
    }, []);

    return (
        <div className="pointer-events-none absolute inset-x-0 top-[38%] -translate-y-1/2 overflow-visible text-primary" aria-hidden="true">
            <svg
                className="block h-auto w-full overflow-visible"
                viewBox="0 0 600 110"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <filter
                        id={glowId}
                        x="-200%"
                        y="-200%"
                        width="400%"
                        height="400%"
                    >
                        <feGaussianBlur
                            stdDeviation="4"
                            result="blur"
                        />

                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Permanent brand-colour line */}
                <path
                    ref={pathRef}
                    id={pathId}
                    d={ENERGY_PATH}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                />

                {/* Permanent round nodes */}
                {nodePoints.map((point, index) => (
                    <g
                        key={NODE_POSITIONS[index]}
                        transform={`translate(${point.x} ${point.y})`}
                    >
                        <circle
                            r="4"
                            fill="currentColor"
                            opacity="0.9"
                        />

                        <circle
                            r="1.5"
                            fill="currentColor"
                            opacity="1"
                        />
                    </g>
                ))}

                {/* One travelling pulse per hover */}
                {active && (
                    <g className="motion-reduce:hidden">
                        {/* Wide outer glow */}
                        <circle
                            r="10"
                            fill="currentColor"
                            opacity="0.15"
                            filter={`url(#${glowId})`}
                        >
                            <animateMotion
                                begin="0s"
                                dur={PULSE_DURATION}
                                repeatCount="1"
                                fill="remove"
                                rotate="auto"
                            >
                                <mpath href={`#${pathId}`} />
                            </animateMotion>

                            <animate
                                attributeName="opacity"
                                values="0;0.2;0.2;0"
                                keyTimes="0;0.08;0.88;1"
                                dur={PULSE_DURATION}
                                repeatCount="1"
                            />
                        </circle>

                        {/* Concentrated glow */}
                        <circle
                            r="6"
                            fill="currentColor"
                            opacity="0.3"
                            filter={`url(#${glowId})`}
                        >
                            <animateMotion
                                begin="0s"
                                dur={PULSE_DURATION}
                                repeatCount="1"
                                fill="remove"
                                rotate="auto"
                            >
                                <mpath href={`#${pathId}`} />
                            </animateMotion>

                            <animate
                                attributeName="opacity"
                                values="0;0.35;0.35;0"
                                keyTimes="0;0.08;0.88;1"
                                dur={PULSE_DURATION}
                                repeatCount="1"
                            />
                        </circle>

                        {/* Bright travelling core */}
                        <circle
                            r="3"
                            fill="currentColor"
                        >
                            <animateMotion
                                begin="0s"
                                dur={PULSE_DURATION}
                                repeatCount="1"
                                fill="remove"
                                rotate="auto"
                            >
                                <mpath href={`#${pathId}`} />
                            </animateMotion>

                            <animate
                                attributeName="opacity"
                                values="0;1;1;0"
                                keyTimes="0;0.05;0.92;1"
                                dur={PULSE_DURATION}
                                repeatCount="1"
                            />
                        </circle>
                    </g>
                )}
            </svg>
        </div>
    );
}