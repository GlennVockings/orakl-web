"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { GlassCard } from "@/components/cards/GlassCard";
import { OraklNav } from "@/components/navigation/OraklNav";

type CardSceneProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  showNavigation?: boolean;
};

export const CardScene = ({
  children,
  className = "",
  contentClassName = "max-w-[680px]",
  showNavigation = true,
}: CardSceneProps) => {
  const sceneRef = useRef<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "-30% 0px -30% 0px",
        threshold: 0,
      },
    );

    observer.observe(scene);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sceneRef}
      className={`
        relative
        flex
        items-center

        px-5
        py-4

        first:pt-24
        last:pb-10

        sm:px-8
        sm:py-5

        md:min-h-screen
        md:px-8
        md:py-20

        lg:px-12

        ${className}
      `}
    >
      <div
        className={`
          relative
          w-full
          ${contentClassName}
        `}
      >
        {showNavigation && (
          <div
            className={`
              absolute
              bottom-full
              left-0
              z-50
              mb-4

              hidden
              md:block

              transition-all
              duration-700
              ease-out

              ${
                isActive
                  ? "translate-y-0 opacity-100 blur-0"
                  : "pointer-events-none translate-y-2 opacity-0 blur-[4px]"
              }
            `}
          >
            <OraklNav />
          </div>
        )}

        {/*
          Route travel owns this outer transform.
          GlassCard keeps complete ownership of its internal
          tilt / float / entrance transform.
        */}
        <div
          data-orakl-travel-object
          className="
            relative
            z-10
            w-full
            [transform-origin:center_center]
            will-change-transform
          "
        >
          <GlassCard className="max-w-none">{children}</GlassCard>
        </div>
      </div>
    </section>
  );
};
