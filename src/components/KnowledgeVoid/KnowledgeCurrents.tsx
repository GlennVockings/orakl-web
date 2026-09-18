"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import { animate } from "animejs";

import type { VoidVanishingPoint } from "./KnowledgeVoid";

type KnowledgeCurrentsProps = {
  vanishingPoint: VoidVanishingPoint;
  mobileVanishingX: number;
};

type Point = {
  x: number;
  y: number;
};

type Edge = "left" | "top" | "right" | "bottom";

type CurrentLayer = "far" | "near";

type Viewport = {
  width: number;
  height: number;
};

type GeneratedCurrent = {
  id: number;
  edge: Edge;
  layer: CurrentLayer;

  start: Point;
  end: Point;

  strokeWidth: number;
  opacity: number;

  waveAmplitude: number;
  waveFrequency: number;
  wavePhase: number;
  waveSpeed: number;
};

type AmbientPulseProps = {
  start: Point;
  end: Point;
  curveOffset: number;
  delay: number;
  duration: number;
  radius: number;
  opacity?: number;
};

type CreateCurrentFieldArgs = {
  count: number;
  vanishingPoint: Point;
  seedOffset: number;
  layer: CurrentLayer;
  world: Viewport;
  coordinateScale: number;
};

type CreateDistributedEdgeStartArgs = {
  edge: Edge;
  position: number;
  count: number;
  random: () => number;
  world: Viewport;
};

const WORLD_WIDTH = 1600;
const DEFAULT_WORLD_HEIGHT = 1000;

const MOBILE_BREAKPOINT = 640;

const DESKTOP_VANISHING_Y_MIN = 0.25;
const DESKTOP_VANISHING_Y_MAX = 0.75;

const VOID_ROUTE_TRAVEL_EVENT = "orakl:void-route-travel";
const DESKTOP_ROUTE_SHIFT = 0.18;

type VoidRouteTravelDetail = {
  phase: "exit" | "enter";
  direction: -1 | 1;
};

const FAR_CURRENT_COUNT = 150;
const NEAR_CURRENT_COUNT = 15;

const WAVE_SEGMENTS = 36;

const EDGES: Edge[] = ["left", "top", "right", "bottom"];

export const KnowledgeCurrents = ({
  vanishingPoint,
  mobileVanishingX,
}: KnowledgeCurrentsProps) => {
  const uniqueId = useId().replace(/:/g, "");

  const containerRef = useRef<HTMLDivElement | null>(null);

  const animatedCurrentsRef = useRef<SVGGElement | null>(null);
  const flowPhaseRef = useRef(0);

  const [worldHeight, setWorldHeight] = useState(DEFAULT_WORLD_HEIGHT);

  const [coordinateScale, setCoordinateScale] = useState(1);

  const [isMobile, setIsMobile] = useState(false);

  const [desktopVanishingY, setDesktopVanishingY] = useState(() =>
    clamp(vanishingPoint.y, DESKTOP_VANISHING_Y_MIN, DESKTOP_VANISHING_Y_MAX),
  );

  const desktopVanishingXRef = useRef(vanishingPoint.x);
  const [desktopVanishingX, setDesktopVanishingX] = useState(vanishingPoint.x);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateWorld = () => {
      const { width, height } = container.getBoundingClientRect();

      if (width <= 0 || height <= 0) {
        return;
      }

      setWorldHeight(WORLD_WIDTH * (height / width));

      setCoordinateScale(WORLD_WIDTH / width);

      setIsMobile(width <= MOBILE_BREAKPOINT);
    };

    updateWorld();

    const resizeObserver = new ResizeObserver(updateWorld);

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    let frameId: number | null = null;

    const updateVanishingPointFromScroll = () => {
      frameId = null;

      const scrollableDistance = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      );

      const scrollProgress =
        scrollableDistance === 0
          ? 0.5
          : clamp(window.scrollY / scrollableDistance, 0, 1);

      const nextY =
        DESKTOP_VANISHING_Y_MIN +
        scrollProgress * (DESKTOP_VANISHING_Y_MAX - DESKTOP_VANISHING_Y_MIN);

      setDesktopVanishingY((currentY) =>
        Math.abs(currentY - nextY) < 0.002 ? currentY : nextY,
      );
    };

    const requestUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateVanishingPointFromScroll);
    };

    requestUpdate();

    window.addEventListener("scroll", requestUpdate, {
      passive: true,
    });

    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      desktopVanishingXRef.current = vanishingPoint.x;
      setDesktopVanishingX(vanishingPoint.x);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let horizontalAnimation: ReturnType<typeof animate> | null = null;

    const handleRouteTravel = (event: Event) => {
      const travelEvent = event as CustomEvent<VoidRouteTravelDetail>;

      const { phase, direction } = travelEvent.detail;

      horizontalAnimation?.cancel();

      if (reducedMotion.matches) {
        desktopVanishingXRef.current = vanishingPoint.x;
        setDesktopVanishingX(vanishingPoint.x);
        return;
      }

      const targetX =
        phase === "exit"
          ? clamp(
              vanishingPoint.x + direction * DESKTOP_ROUTE_SHIFT,
              0.18,
              0.82,
            )
          : vanishingPoint.x;

      const state = {
        x: desktopVanishingXRef.current,
      };

      horizontalAnimation = animate(state, {
        x: targetX,
        duration: phase === "exit" ? 420 : 620,
        ease: phase === "exit" ? "inOut(3)" : "out(4)",
        onUpdate: () => {
          desktopVanishingXRef.current = state.x;
          setDesktopVanishingX(state.x);
        },
        onComplete: () => {
          desktopVanishingXRef.current = targetX;
          setDesktopVanishingX(targetX);
          horizontalAnimation = null;
        },
      });
    };

    window.addEventListener(VOID_ROUTE_TRAVEL_EVENT, handleRouteTravel);

    return () => {
      window.removeEventListener(VOID_ROUTE_TRAVEL_EVENT, handleRouteTravel);

      horizontalAnimation?.cancel();
    };
  }, [isMobile, vanishingPoint.x]);

  const world = useMemo<Viewport>(
    () => ({
      width: WORLD_WIDTH,

      height: worldHeight,
    }),
    [worldHeight],
  );

  const effectiveVanishingPoint = useMemo<VoidVanishingPoint>(
    () =>
      isMobile
        ? {
            x: mobileVanishingX,

            y: 0.5,
          }
        : {
            x: desktopVanishingX,
            y: desktopVanishingY,
          },
    [desktopVanishingX, desktopVanishingY, isMobile, mobileVanishingX],
  );

  const vanishingPointPx = useMemo<Point>(
    () => ({
      x: world.width * effectiveVanishingPoint.x,

      y: world.height * effectiveVanishingPoint.y,
    }),
    [
      effectiveVanishingPoint.x,
      effectiveVanishingPoint.y,
      world.width,
      world.height,
    ],
  );

  const farCurrents = useMemo(
    () =>
      createCurrentField({
        count: FAR_CURRENT_COUNT,

        vanishingPoint: vanishingPointPx,

        seedOffset: 1000,

        layer: "far",

        world,

        coordinateScale,
      }),
    [
      vanishingPointPx.x,
      vanishingPointPx.y,
      world.width,
      world.height,
      coordinateScale,
    ],
  );

  const nearCurrents = useMemo(
    () =>
      createCurrentField({
        count: NEAR_CURRENT_COUNT,

        vanishingPoint: vanishingPointPx,

        seedOffset: 9000,

        layer: "near",

        world,

        coordinateScale,
      }),
    [
      vanishingPointPx.x,
      vanishingPointPx.y,
      world.width,
      world.height,
      coordinateScale,
    ],
  );

  const allCurrents = [...farCurrents, ...nearCurrents];

  useEffect(() => {
    const group = animatedCurrentsRef.current;

    if (!group || isMobile) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      return;
    }

    const pathElements = group.querySelectorAll<SVGPathElement>(
      "[data-animated-current]",
    );

    const animationState = {
      time: flowPhaseRef.current,
    };

    const animation = animate(animationState, {
      time: flowPhaseRef.current + Math.PI * 2,

      duration: 16500,

      ease: "linear",

      loop: true,

      onUpdate: () => {
        flowPhaseRef.current = animationState.time;

        nearCurrents.forEach((current, index) => {
          const pathElement = pathElements[index];

          if (!pathElement) {
            return;
          }

          const phase =
            current.wavePhase + animationState.time * current.waveSpeed;

          pathElement.setAttribute("d", createFlowingPath(current, phase));
        });
      },
    });

    return () => {
      /*
       * Endpoint changes regenerate geometry while scroll/route travel
       * moves the vanishing point. Preserve the wave clock so the
       * replacement paths continue from the same phase instead of
       * visibly restarting/pulsing.
       */
      flowPhaseRef.current = animationState.time;
      animation.cancel();
    };
  }, [isMobile, nearCurrents]);

  const pulseRadiusScale = coordinateScale;

  const pulseCurveScale = coordinateScale;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        inset-0
        overflow-hidden
      "
    >
      <svg
        className="h-full w-full"
        viewBox={`
          0
          0
          ${WORLD_WIDTH}
          ${worldHeight}
        `}
        preserveAspectRatio="none"
      >
        <defs>
          {allCurrents.map((current) => (
            <linearGradient
              key={current.id}
              id={getCurrentGradientId(uniqueId, current)}
              gradientUnits="userSpaceOnUse"
              x1={current.start.x}
              y1={current.start.y}
              x2={current.end.x}
              y2={current.end.y}
            >
              {current.layer === "far" ? (
                <>
                  <stop offset="0%" stopColor="white" stopOpacity="1" />

                  <stop offset="48%" stopColor="white" stopOpacity="0.88" />

                  <stop offset="68%" stopColor="white" stopOpacity="0.5" />

                  <stop offset="84%" stopColor="white" stopOpacity="0.14" />

                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="white" stopOpacity="0.82" />

                  <stop offset="46%" stopColor="white" stopOpacity="0.7" />

                  <stop offset="66%" stopColor="white" stopOpacity="0.4" />

                  <stop offset="84%" stopColor="white" stopOpacity="0.1" />

                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </>
              )}
            </linearGradient>
          ))}
        </defs>

        <g>
          {farCurrents.map((current) => (
            <path
              key={current.id}
              d={createStaticPath(current)}
              fill="none"
              stroke={`url(#${getCurrentGradientId(uniqueId, current)})`}
              strokeWidth={current.strokeWidth}
              strokeLinecap="round"
              opacity={current.opacity}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        <g ref={animatedCurrentsRef}>
          {nearCurrents.map((current) => (
            <path
              key={current.id}
              data-animated-current
              d={
                isMobile
                  ? createFlowingPath(current, current.wavePhase)
                  : createStaticPath(current)
              }
              fill="none"
              stroke={`url(#${getCurrentGradientId(uniqueId, current)})`}
              strokeWidth={current.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={current.opacity}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {!isMobile && (
          <g>
            <AmbientPulse
              start={{
                x: -world.width * 0.14,

                y: world.height * 0.12,
              }}
              end={vanishingPointPx}
              curveOffset={-55 * pulseCurveScale}
              delay={0}
              duration={7600}
              radius={2.8 * pulseRadiusScale}
            />

            <AmbientPulse
              start={{
                x: -world.width * 0.14,

                y: world.height * 0.4,
              }}
              end={vanishingPointPx}
              curveOffset={-10 * pulseCurveScale}
              delay={900}
              duration={8200}
              radius={3.1 * pulseRadiusScale}
            />

            <AmbientPulse
              start={{
                x: -world.width * 0.14,

                y: world.height * 0.76,
              }}
              end={vanishingPointPx}
              curveOffset={45 * pulseCurveScale}
              delay={1800}
              duration={8800}
              radius={2.6 * pulseRadiusScale}
            />

            <AmbientPulse
              start={{
                x: world.width * 0.2,

                y: -world.height * 0.08,
              }}
              end={vanishingPointPx}
              curveOffset={-35 * pulseCurveScale}
              delay={500}
              duration={8000}
              radius={2.7 * pulseRadiusScale}
            />

            <AmbientPulse
              start={{
                x: world.width * 0.58,

                y: -world.height * 0.08,
              }}
              end={vanishingPointPx}
              curveOffset={5 * pulseCurveScale}
              delay={2200}
              duration={9000}
              radius={2.9 * pulseRadiusScale}
            />

            <AmbientPulse
              start={{
                x: world.width * 0.18,

                y: world.height * 1.12,
              }}
              end={vanishingPointPx}
              curveOffset={45 * pulseCurveScale}
              delay={1300}
              duration={8400}
              radius={2.8 * pulseRadiusScale}
            />

            <AmbientPulse
              start={{
                x: world.width * 0.52,

                y: world.height * 1.12,
              }}
              end={vanishingPointPx}
              curveOffset={15 * pulseCurveScale}
              delay={3100}
              duration={9200}
              radius={2.5 * pulseRadiusScale}
            />

            <AmbientPulse
              start={{
                x: world.width * 1.14,

                y: world.height * 0.1,
              }}
              end={vanishingPointPx}
              curveOffset={-35 * pulseCurveScale}
              delay={700}
              duration={7800}
              radius={2.8 * pulseRadiusScale}
            />

            <AmbientPulse
              start={{
                x: world.width * 1.14,

                y: world.height * 0.5,
              }}
              end={vanishingPointPx}
              curveOffset={-5 * pulseCurveScale}
              delay={2500}
              duration={8600}
              radius={3.2 * pulseRadiusScale}
            />

            <AmbientPulse
              start={{
                x: world.width * 1.14,

                y: world.height * 0.9,
              }}
              end={vanishingPointPx}
              curveOffset={25 * pulseCurveScale}
              delay={3700}
              duration={9400}
              radius={2.6 * pulseRadiusScale}
            />
          </g>
        )}
      </svg>
    </div>
  );
};

function getCurrentGradientId(uniqueId: string, current: GeneratedCurrent) {
  return `current-${uniqueId}-${current.id}`;
}

function createCurrentField({
  count,
  vanishingPoint,
  seedOffset,
  layer,
  world,
  coordinateScale,
}: CreateCurrentFieldArgs): GeneratedCurrent[] {
  const basePerEdge = Math.floor(count / EDGES.length);

  const remainder = count % EDGES.length;

  const currents: GeneratedCurrent[] = [];

  let currentIndex = 0;

  EDGES.forEach((edge, edgeIndex) => {
    const edgeCount = basePerEdge + (edgeIndex < remainder ? 1 : 0);

    for (let edgePosition = 0; edgePosition < edgeCount; edgePosition += 1) {
      const random = createSeededRandom(seedOffset + (currentIndex + 1) * 1013);

      const start = createDistributedEdgeStart({
        edge,
        position: edgePosition,
        count: edgeCount,
        random,
        world,
      });

      const edgeVisibilityBoost =
        edge === "right" || edge === "bottom" ? 1.12 : 1;

      const responsiveWaveScale = Math.max(1, coordinateScale * 0.8);

      currents.push({
        id: seedOffset + currentIndex,

        edge,
        layer,

        start,

        end: vanishingPoint,

        strokeWidth:
          layer === "far" ? 0.3 + random() * 0.34 : 1 + random() * 0.6,

        opacity: Math.min(
          1,
          (layer === "far" ? 0.2 + random() * 0.2 : 0.28 + random() * 0.18) *
            edgeVisibilityBoost,
        ),

        waveAmplitude:
          layer === "near" ? (45 + random() * 60) * responsiveWaveScale : 0,

        waveFrequency: 0.72 + random() * 0.5,

        wavePhase: random() * Math.PI * 2,

        waveSpeed: 0.72 + random() * 0.5,
      });

      currentIndex += 1;
    }
  });

  return currents;
}

function createDistributedEdgeStart({
  edge,
  position,
  count,
  random,
  world,
}: CreateDistributedEdgeStartArgs): Point {
  const progress = count <= 1 ? 0.5 : position / (count - 1);

  const edgeLength =
    edge === "left" || edge === "right" ? world.height : world.width;

  const jitter = (random() - 0.5) * edgeLength * 0.018;

  switch (edge) {
    case "left":
      return {
        x: -world.width * 0.14,

        y: -world.height * 0.08 + progress * world.height * 1.16 + jitter,
      };

    case "top":
      return {
        x: -world.width * 0.08 + progress * world.width * 1.16 + jitter,

        y: -world.height * 0.08,
      };

    case "right":
      return {
        x: world.width * 1.14,

        y: -world.height * 0.08 + progress * world.height * 1.16 + jitter,
      };

    case "bottom":
      return {
        x: -world.width * 0.08 + progress * world.width * 1.16 + jitter,

        y: world.height * 1.12,
      };
  }
}

function createStaticPath(current: GeneratedCurrent) {
  const controlOne: Point = {
    x: current.start.x + (current.end.x - current.start.x) * 0.32,

    y: current.start.y + (current.end.y - current.start.y) * 0.32,
  };

  const controlTwo: Point = {
    x: current.start.x + (current.end.x - current.start.x) * 0.76,

    y: current.start.y + (current.end.y - current.start.y) * 0.76,
  };

  return `
    M
      ${current.start.x}
      ${current.start.y}

    C
      ${controlOne.x}
      ${controlOne.y}

      ${controlTwo.x}
      ${controlTwo.y}

      ${current.end.x}
      ${current.end.y}
  `;
}

function createFlowingPath(current: GeneratedCurrent, phase: number) {
  const directionX = current.end.x - current.start.x;

  const directionY = current.end.y - current.start.y;

  const length = Math.max(Math.hypot(directionX, directionY), 1);

  const perpendicularX = -directionY / length;

  const perpendicularY = directionX / length;

  const points: Point[] = [];

  for (let segment = 0; segment <= WAVE_SEGMENTS; segment += 1) {
    const progress = segment / WAVE_SEGMENTS;

    const baseX = current.start.x + directionX * progress;

    const baseY = current.start.y + directionY * progress;

    const envelope = Math.sin(Math.PI * progress);

    const wave = Math.sin(
      progress * current.waveFrequency * Math.PI * 2 - phase,
    );

    const perspective = 1 - progress * 0.35;

    const displacement = current.waveAmplitude * envelope * wave * perspective;

    points.push({
      x: baseX + perpendicularX * displacement,

      y: baseY + perpendicularY * displacement,
    });
  }

  return createSmoothPath(points);
}

function createSmoothPath(points: Point[]) {
  if (points.length < 2) {
    return "";
  }

  let path = `
    M
      ${points[0].x}
      ${points[0].y}
  `;

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(index - 1, 0)];

    const current = points[index];

    const next = points[index + 1];

    const following = points[Math.min(index + 2, points.length - 1)];

    const controlOne: Point = {
      x: current.x + (next.x - previous.x) / 6,

      y: current.y + (next.y - previous.y) / 6,
    };

    const controlTwo: Point = {
      x: next.x - (following.x - current.x) / 6,

      y: next.y - (following.y - current.y) / 6,
    };

    path += `
      C
        ${controlOne.x}
        ${controlOne.y}

        ${controlTwo.x}
        ${controlTwo.y}

        ${next.x}
        ${next.y}
    `;
  }

  return path;
}

function createPerspectivePath(start: Point, end: Point, curveOffset: number) {
  const controlOne: Point = {
    x: start.x + (end.x - start.x) * 0.32,

    y: start.y + (end.y - start.y) * 0.28 + curveOffset,
  };

  const controlTwo: Point = {
    x: start.x + (end.x - start.x) * 0.76,

    y: start.y + (end.y - start.y) * 0.76,
  };

  return `
    M
      ${start.x}
      ${start.y}

    C
      ${controlOne.x}
      ${controlOne.y}

      ${controlTwo.x}
      ${controlTwo.y}

      ${end.x}
      ${end.y}
  `;
}

const AmbientPulse = ({
  start,
  end,
  curveOffset,
  delay,
  duration,
  radius,
  opacity = 0.78,
}: AmbientPulseProps) => {
  const pathRef = useRef<SVGPathElement | null>(null);

  const pulseRef = useRef<SVGCircleElement | null>(null);

  const path = createPerspectivePath(start, end, curveOffset);

  useEffect(() => {
    const pathElement = pathRef.current;

    const pulseElement = pulseRef.current;

    if (!pathElement || !pulseElement) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      return;
    }

    const totalLength = pathElement.getTotalLength();

    const state = {
      progress: 0,
    };

    const animation = animate(state, {
      progress: 1,

      duration,
      delay,

      ease: "in(2)",

      loop: true,

      onUpdate: () => {
        const point = pathElement.getPointAtLength(
          totalLength * state.progress,
        );

        pulseElement.setAttribute("cx", String(point.x));

        pulseElement.setAttribute("cy", String(point.y));

        const currentRadius = radius * (1 - state.progress * 0.9);

        pulseElement.setAttribute("r", String(Math.max(currentRadius, 0.2)));

        pulseElement.setAttribute(
          "opacity",
          String(getPulseOpacity(state.progress, opacity)),
        );
      },

      onLoop: () => {
        state.progress = 0;
      },
    });

    return () => {
      animation.cancel();
    };
  }, [delay, duration, opacity, radius, path]);

  return (
    <>
      <path ref={pathRef} d={path} fill="none" stroke="none" />

      <circle
        ref={pulseRef}
        cx={start.x}
        cy={start.y}
        r={radius}
        fill="white"
        opacity="0"
      />
    </>
  );
};

function getPulseOpacity(progress: number, maximumOpacity: number) {
  if (progress < 0.06) {
    return (progress / 0.06) * maximumOpacity;
  }

  if (progress < 0.72) {
    return maximumOpacity;
  }

  const fadeProgress = (progress - 0.72) / 0.28;

  return maximumOpacity * (1 - fadeProgress);
}

function createSeededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;

    let result = value;

    result = Math.imul(result ^ (result >>> 15), result | 1);

    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);

    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}
