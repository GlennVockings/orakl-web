"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
} from "react";

type Point = {
  x: number;
  y: number;
};

type KnowledgeStreamProps = {
  containerRef: RefObject<HTMLElement | null>;
};

function findClosestPathLength(
  path: SVGPathElement,
  totalLength: number,
  target: Point,
) {
  const samples = 300;

  let closestLength = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index <= samples; index += 1) {
    const length = totalLength * (index / samples);

    const point = path.getPointAtLength(length);

    const distance =
      Math.pow(point.x - target.x, 2) + Math.pow(point.y - target.y, 2);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestLength = length;
    }
  }

  return closestLength;
}

export function KnowledgeStream({ containerRef }: KnowledgeStreamProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGGElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const nodeLengthsRef = useRef<number[]>([]);
  const activeNodeIndexRef = useRef<number | null>(null);

  const [points, setPoints] = useState<Point[]>([]);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const uniqueId = useId().replace(/:/g, "");
  const pulseGlowId = `knowledge-stream-pulse-glow-${uniqueId}`;

  const measure = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();

    const nodeElements = container.querySelectorAll<HTMLElement>(
      "[data-knowledge-node]",
    );

    const measuredPoints = Array.from(nodeElements).map((node) => {
      const nodeRect = node.getBoundingClientRect();

      return {
        x: nodeRect.left - containerRect.left + nodeRect.width / 2,
        y: nodeRect.top - containerRect.top + nodeRect.height / 2,
      };
    });

    setSize({
      width: container.clientWidth,
      height: container.scrollHeight,
    });

    setPoints(measuredPoints);
  }, [containerRef]);

  const activateNode = useCallback(
    (activeIndex: number | null) => {
      if (activeNodeIndexRef.current === activeIndex) {
        return;
      }

      const container = containerRef.current;

      if (!container) {
        return;
      }

      const stations = container.querySelectorAll<HTMLElement>(
        "[data-knowledge-station]",
      );

      stations.forEach((station, index) => {
        if (index === activeIndex) {
          station.dataset.active = "true";
        } else {
          delete station.dataset.active;
        }
      });

      activeNodeIndexRef.current = activeIndex;
    },
    [containerRef],
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    measure();

    const resizeObserver = new ResizeObserver(measure);

    resizeObserver.observe(container);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, measure]);

  const path = createStreamPath(points, size.height);

  useEffect(() => {
    const container = containerRef.current;
    const pathElement = pathRef.current;
    const pulseElement = pulseRef.current;

    if (!container || !pathElement || !pulseElement || !path) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      pulseElement.style.opacity = "0";
      return;
    }

    const totalLength = pathElement.getTotalLength();

    const stationNodes = container.querySelectorAll<HTMLElement>(
      "[data-knowledge-node]",
    );

    nodeLengthsRef.current = Array.from(stationNodes).map((node) => {
      const nodeRect = node.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const targetPoint = {
        x: nodeRect.left - containerRect.left + nodeRect.width / 2,
        y: nodeRect.top - containerRect.top + nodeRect.height / 2,
      };

      return findClosestPathLength(pathElement, totalLength, targetPoint);
    });

    const updatePulse = () => {
      animationFrameRef.current = null;

      const containerRect = container.getBoundingClientRect();

      /*
       * The journey starts when the top of the Knowledge Void
       * reaches 65% of the viewport height.
       */
      const startLine = window.innerHeight * 0.4;

      /*
       * It finishes when the bottom of the Knowledge Void
       * reaches 35% of the viewport height.
       */
      const endLine = window.innerHeight * 0.75;

      const scrollableDistance = containerRect.height + startLine - endLine;

      const travelledDistance = startLine - containerRect.top;

      const progress = clamp(travelledDistance / scrollableDistance, 0, 1);

      const point = pathElement.getPointAtLength(totalLength * progress);

      const currentLength = totalLength * progress;

      let reachedNodeIndex: number | null = null;

      nodeLengthsRef.current.forEach((nodeLength, index) => {
        if (currentLength >= nodeLength) {
          reachedNodeIndex = index;
        }
      });

      activateNode(reachedNodeIndex);

      pulseElement.setAttribute(
        "transform",
        `translate(${point.x} ${point.y})`,
      );

      const isInsideJourney =
        travelledDistance >= 0 && travelledDistance <= scrollableDistance;

      pulseElement.style.opacity = isInsideJourney ? "1" : "0";
    };

    const requestPulseUpdate = () => {
      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current = requestAnimationFrame(updatePulse);
    };

    updatePulse();

    window.addEventListener("scroll", requestPulseUpdate, {
      passive: true,
    });

    window.addEventListener("resize", requestPulseUpdate);

    return () => {
      window.removeEventListener("scroll", requestPulseUpdate);

      window.removeEventListener("resize", requestPulseUpdate);

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      activateNode(null);
    };
  }, [activateNode, containerRef, path]);

  if (points.length === 0 || size.width === 0 || size.height === 0) {
    return null;
  }

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${size.width} ${size.height}`}
      preserveAspectRatio="none"
      className="
        pointer-events-none
        absolute
        inset-0
        z-[5]
        hidden
        h-full
        w-full
        overflow-visible
        text-primary
        lg:block
      "
    >
      <defs>
        <filter id={pulseGlowId} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="5" result="pulseBlur" />

          <feMerge>
            <feMergeNode in="pulseBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Foreground Knowledge Stream */}
      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity="0.3"
      />

      {/* Scroll-controlled pulse */}
      <g
        ref={pulseRef}
        className="transition-opacity duration-200"
        style={{ opacity: 0 }}
      >
        <circle
          r="13"
          fill="currentColor"
          opacity="0.12"
          filter={`url(#${pulseGlowId})`}
        />

        <circle
          r="7"
          fill="currentColor"
          opacity="0.3"
          filter={`url(#${pulseGlowId})`}
        />

        <circle r="3.5" fill="currentColor" />

        <circle r="1.25" fill="white" opacity="0.9" />
      </g>
    </svg>
  );
}

function createStreamPath(points: Point[], containerHeight: number) {
  if (points.length === 0) {
    return "";
  }

  const [firstPoint, ...remainingPoints] = points;

  let path = `
    M ${firstPoint.x} 0
    L ${firstPoint.x} ${firstPoint.y}
  `;

  remainingPoints.forEach((point, index) => {
    const previousPoint = points[index];

    const midpointY = previousPoint.y + (point.y - previousPoint.y) / 2;

    path += `
      C
        ${previousPoint.x} ${midpointY}
        ${point.x} ${midpointY}
        ${point.x} ${point.y}
    `;
  });

  const lastPoint = points[points.length - 1];

  const endY = Math.min(containerHeight, lastPoint.y + 320);

  path += `
    L ${lastPoint.x} ${endY}
  `;

  return path;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}
