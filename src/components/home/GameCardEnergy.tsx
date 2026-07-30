"use client";

import {
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

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

const PULSE_DURATION_MS = 1000;

export default function GameCardEnergy({
    active,
}: GameCardEnergyProps) {
    const pathRef = useRef<SVGPathElement>(null);
    const animationFrameRef = useRef<number | null>(null);

    const [nodePoints, setNodePoints] = useState<Point[]>([]);
    const [pulsePoint, setPulsePoint] = useState<Point | null>(
        null
    );
    const [pulseOpacity, setPulseOpacity] = useState(0);

    const uniqueId = useId().replace(/:/g, "");
    const glowId = `game-card-energy-glow-${uniqueId}`;

    /**
     * Calculate the fixed node positions once the SVG path
     * exists in the browser.
     */
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

    /**
     * Run one pulse from the beginning to the end of the path
     * whenever the card becomes active.
     */
    useEffect(() => {
        const path = pathRef.current;

        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (!active || !path) {
            setPulsePoint(null);
            setPulseOpacity(0);
            return;
        }

        const prefersReducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        if (prefersReducedMotion) {
            return;
        }

        const totalLength = path.getTotalLength();
        const startedAt = performance.now();

        const animatePulse = (currentTime: number) => {
            const elapsed = currentTime - startedAt;

            const rawProgress = Math.min(
                elapsed / PULSE_DURATION_MS,
                1
            );

            /**
             * Ease out:
             * fast at the start, slightly softer near the end.
             */
            const easedProgress =
                1 - Math.pow(1 - rawProgress, 3);

            const point = path.getPointAtLength(
                totalLength * easedProgress
            );

            /**
             * Fade in during the first 10% and fade out
             * during the final 15%.
             */
            let opacity = 1;

            if (rawProgress < 0.1) {
                opacity = rawProgress / 0.1;
            } else if (rawProgress > 0.85) {
                opacity =
                    1 - (rawProgress - 0.85) / 0.15;
            }

            setPulsePoint({
                x: point.x,
                y: point.y,
            });

            setPulseOpacity(Math.max(0, opacity));

            if (rawProgress < 1) {
                animationFrameRef.current =
                    requestAnimationFrame(animatePulse);
            } else {
                setPulsePoint(null);
                setPulseOpacity(0);
                animationFrameRef.current = null;
            }
        };

        animationFrameRef.current =
            requestAnimationFrame(animatePulse);

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(
                    animationFrameRef.current
                );

                animationFrameRef.current = null;
            }
        };
    }, [active]);

    return (
        <div
            className="
                pointer-events-none
                absolute
                inset-x-0
                top-[32%]
                -translate-y-1/2
                overflow-visible
                text-primary
            "
            aria-hidden="true"
        >
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

                {/* Permanent energy line */}
                <path
                    ref={pathRef}
                    d={ENERGY_PATH}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                />

                {/* Permanent nodes */}
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
                        />
                    </g>
                ))}

                {/* Travelling pulse */}
                {pulsePoint && (
                    <g
                        transform={`translate(${pulsePoint.x} ${pulsePoint.y})`}
                        opacity={pulseOpacity}
                    >
                        {/* Large soft bloom */}
                        <circle
                            r="11"
                            fill="currentColor"
                            opacity="0.16"
                            filter={`url(#${glowId})`}
                        />

                        {/* Concentrated glow */}
                        <circle
                            r="6"
                            fill="currentColor"
                            opacity="0.32"
                            filter={`url(#${glowId})`}
                        />

                        {/* Bright packet core */}
                        <circle
                            r="3"
                            fill="currentColor"
                        />

                        {/* Small white-hot centre */}
                        <circle
                            r="1.25"
                            fill="white"
                            opacity="0.9"
                        />
                    </g>
                )}
            </svg>
        </div>
    );
}