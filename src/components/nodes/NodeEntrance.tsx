"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate } from "animejs";

import { KnowledgeVoid } from "@/components/KnowledgeVoid/KnowledgeVoid";

type NodeEntranceProps = {
  children: ReactNode;
  label: string;
};

const ENTRANCE_DURATION = 1100;

export const NodeEntrance = ({ children, label }: NodeEntranceProps) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [showVoid, setShowVoid] = useState(true);
  const [entranceComplete, setEntranceComplete] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    const content = contentRef.current;

    if (!node || !content) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setShowVoid(false);
      setEntranceComplete(true);

      node.style.opacity = "0";
      content.style.opacity = "1";

      return;
    }

    node.style.opacity = "1";
    node.style.transform = "translate(-50%, -50%) scale(1)";

    content.style.opacity = "0";

    const entrance = animate(node, {
      scale: [1, 45],
      borderRadius: ["9999px", "32px"],
      duration: ENTRANCE_DURATION,
      ease: "inOutExpo",

      onComplete: () => {
        setShowVoid(false);
        setEntranceComplete(true);

        content.style.opacity = "1";
      },
    });

    return () => {
      entrance.cancel();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050507]">
      {showVoid ? (
        <div className="fixed inset-0 z-0">
          <KnowledgeVoid
            vanishingPoint={{
              x: 0.5,
              y: 0.5,
            }}
            mobileVanishingX={0.5}
          />
        </div>
      ) : null}

      {!entranceComplete ? (
        <div
          ref={nodeRef}
          className="
            fixed
            left-1/2
            top-1/2
            z-20
            flex
            size-20
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/25
            bg-white/[0.04]
            shadow-[0_0_80px_rgba(255,255,255,0.12)]
            backdrop-blur-md
            will-change-transform
          "
        >
          <span
            className="
              whitespace-nowrap
              text-[10px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-white/70
            "
          >
            {label}
          </span>
        </div>
      ) : null}

      <div
        ref={contentRef}
        className="
          relative
          z-10
          min-h-screen
          opacity-0
          transition-opacity
          duration-300
        "
      >
        {children}
      </div>
    </div>
  );
};
