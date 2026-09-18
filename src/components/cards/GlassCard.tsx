"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { animate } from "animejs";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

type MobileTransformState = {
  translateX: number;
  translateY: number;
  translateZ: number;
  scale: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
};

const MAX_DESKTOP_ROTATION = 2;

const ENTRANCE_DURATION = 900;
const DESKTOP_RESPONSE_DURATION = 750;
const DESKTOP_RESET_DURATION = 1100;
const MOBILE_FLOAT_DURATION = 7000;

export const GlassCard = ({ children, className = "" }: GlassCardProps) => {
  const cardRef = useRef<HTMLElement | null>(null);

  const entranceAnimationRef = useRef<ReturnType<typeof animate> | null>(null);

  const opacityAnimationRef = useRef<ReturnType<typeof animate> | null>(null);

  const motionAnimationRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    let currentMode: "desktop" | "mobile" | "reduced" | null = null;

    let removeDesktopListeners: (() => void) | undefined;

    const clearAnimations = () => {
      entranceAnimationRef.current?.cancel();
      opacityAnimationRef.current?.cancel();
      motionAnimationRef.current?.cancel();

      entranceAnimationRef.current = null;
      opacityAnimationRef.current = null;
      motionAnimationRef.current = null;

      removeDesktopListeners?.();

      removeDesktopListeners = undefined;
    };

    const resetCardStyles = () => {
      card.style.opacity = "1";
      card.style.filter = "none";
      card.style.transform = "";
    };

    const applyMobileTransform = (state: MobileTransformState) => {
      card.style.transform = `
        translate3d(
          ${state.translateX}px,
          ${state.translateY}px,
          ${state.translateZ}px
        )
        scale(${state.scale})
        rotateX(${state.rotateX}deg)
        rotateY(${state.rotateY}deg)
        rotateZ(${state.rotateZ}deg)
      `;
    };

    const startDesktopMotion = () => {
      const handlePointerMove = (event: PointerEvent) => {
        const normalizedX = (event.clientX / window.innerWidth - 0.5) * 2;

        const normalizedY = (event.clientY / window.innerHeight - 0.5) * 2;

        const rotateY = normalizedX * MAX_DESKTOP_ROTATION;

        const rotateX = -normalizedY * MAX_DESKTOP_ROTATION;

        motionAnimationRef.current?.cancel();

        motionAnimationRef.current = animate(card, {
          rotateX,
          rotateY,

          duration: DESKTOP_RESPONSE_DURATION,

          ease: "out(4)",
        });
      };

      const resetCard = () => {
        motionAnimationRef.current?.cancel();

        motionAnimationRef.current = animate(card, {
          rotateX: 0,
          rotateY: 0,

          duration: DESKTOP_RESET_DURATION,

          ease: "out(4)",
        });
      };

      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      window.addEventListener("blur", resetCard);

      removeDesktopListeners = () => {
        window.removeEventListener("pointermove", handlePointerMove);

        window.removeEventListener("blur", resetCard);
      };
    };

    const startMobileMotion = (state?: MobileTransformState) => {
      const mobileState = state ?? {
        translateX: -2,
        translateY: 2,
        translateZ: 0,

        scale: 1,

        rotateX: -0.6,
        rotateY: 0.8,
        rotateZ: -0.35,
      };

      applyMobileTransform(mobileState);

      motionAnimationRef.current = animate(mobileState, {
        translateX: 3,
        translateY: -3,

        translateZ: 0,
        scale: 1,

        rotateX: 0.8,
        rotateY: -0.8,
        rotateZ: 0.35,

        duration: MOBILE_FLOAT_DURATION,

        ease: "inOut(2)",

        alternate: true,
        loop: true,

        onUpdate: () => {
          applyMobileTransform(mobileState);
        },
      });
    };

    const startMobileEntrance = () => {
      const state: MobileTransformState = {
        /*
         * Begin slightly deeper and lower
         * than the normal mobile resting
         * position.
         *
         * Rotation already matches the
         * beginning of the float so there
         * is no transform handoff.
         */
        translateX: -2,
        translateY: 10,
        translateZ: -30,

        scale: 0.965,

        rotateX: -0.6,
        rotateY: 0.8,
        rotateZ: -0.35,
      };

      /*
       * Mobile deliberately does NOT
       * animate filter/blur.
       *
       * Backdrop-filter + animated filter
       * can cause expensive layer
       * recomposition and visible snapping
       * on mobile browsers.
       */
      card.style.opacity = "0";
      card.style.filter = "none";

      applyMobileTransform(state);

      /*
       * Spatial entrance.
       *
       * Keep the stronger out easing here
       * because this controls movement,
       * scale and depth rather than the
       * perceived fade.
       */
      entranceAnimationRef.current = animate(state, {
        translateX: -2,
        translateY: 2,
        translateZ: 0,

        scale: 1,

        rotateX: -0.6,
        rotateY: 0.8,
        rotateZ: -0.35,

        duration: ENTRANCE_DURATION,

        ease: "out(4)",

        onUpdate: () => {
          applyMobileTransform(state);
        },

        onComplete: () => {
          entranceAnimationRef.current = null;

          /*
           * The transform state is
           * already exactly where the
           * mobile float expects it.
           */
          startMobileMotion(state);
        },
      });

      /*
       * Opacity is deliberately separate
       * from the spatial animation.
       *
       * A softer symmetric easing prevents
       * the card from reaching most of its
       * visible opacity too early.
       */
      opacityAnimationRef.current = animate(card, {
        opacity: [0, 1],

        duration: ENTRANCE_DURATION,

        ease: "inOut(2)",

        onComplete: () => {
          /*
           * Explicitly settle the final
           * value rather than relying on
           * an interpolated final frame.
           */
          card.style.opacity = "1";

          opacityAnimationRef.current = null;
        },
      });
    };

    const startDesktopEntrance = () => {
      card.style.opacity = "0";
      card.style.filter = "blur(10px)";

      card.style.transform = `
        scale(0.965)
        translateZ(-30px)
      `;

      entranceAnimationRef.current = animate(card, {
        opacity: 1,

        scale: 1,
        translateZ: 0,

        filter: "blur(0px)",

        duration: ENTRANCE_DURATION,

        ease: "out(4)",

        onComplete: () => {
          entranceAnimationRef.current = null;

          card.style.transform = "";

          startDesktopMotion();
        },
      });
    };

    const startMotionForMode = () => {
      clearAnimations();

      const reducedMotion = reducedMotionQuery.matches;

      const coarsePointer = coarsePointerQuery.matches;

      const nextMode = reducedMotion
        ? "reduced"
        : coarsePointer
          ? "mobile"
          : "desktop";

      currentMode = nextMode;

      if (nextMode === "reduced") {
        resetCardStyles();

        return;
      }

      resetCardStyles();

      if (nextMode === "mobile") {
        startMobileMotion();

        return;
      }

      startDesktopMotion();
    };

    /*
     * INITIAL ENTRANCE
     */
    if (reducedMotionQuery.matches) {
      resetCardStyles();

      currentMode = "reduced";
    } else if (coarsePointerQuery.matches) {
      currentMode = "mobile";

      startMobileEntrance();
    } else {
      currentMode = "desktop";

      startDesktopEntrance();
    }

    /*
     * Don't assume the user's input
     * environment stays the same.
     *
     * Covers:
     * - tablets with mice
     * - convertible laptops
     * - reduced-motion setting changes
     */
    const handleEnvironmentChange = () => {
      const nextMode = reducedMotionQuery.matches
        ? "reduced"
        : coarsePointerQuery.matches
          ? "mobile"
          : "desktop";

      if (nextMode === currentMode) {
        return;
      }

      startMotionForMode();
    };

    reducedMotionQuery.addEventListener("change", handleEnvironmentChange);

    coarsePointerQuery.addEventListener("change", handleEnvironmentChange);

    return () => {
      clearAnimations();

      reducedMotionQuery.removeEventListener("change", handleEnvironmentChange);

      coarsePointerQuery.removeEventListener("change", handleEnvironmentChange);

      resetCardStyles();
    };
  }, []);

  return (
    <div
      className="
        w-full
        [perspective:1400px]
      "
    >
      <article
        ref={cardRef}
        className={`
          relative
          isolate
          w-full
          overflow-hidden

          rounded-[28px]
          sm:rounded-[32px]

          border
          border-white/[0.16]

          bg-white/[0.01]

          px-6
          py-7

          sm:px-8
          sm:py-9

          lg:px-10
          lg:py-10

          shadow-[0_30px_90px_rgba(0,0,0,0.42)]

          supports-[backdrop-filter:blur(1px)]:backdrop-blur-[8px]
          supports-[backdrop-filter:blur(1px)]:backdrop-saturate-[1.08]

          [transform-style:preserve-3d]
          will-change-transform

          ${className}
        `}
      >
        {/* Surface reflection */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-[inherit]

            bg-[linear-gradient(145deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.015)_26%,transparent_55%)]
          "
        />

        {/* Internal edge depth */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-[1px]
            rounded-[inherit]

            shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(255,255,255,0.025)]
          "
        />

        {/* Top rim */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-10
            top-0
            h-px

            bg-gradient-to-r
            from-transparent
            via-white/[0.28]
            to-transparent
          "
        />

        {/* Bottom rim */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-12
            bottom-0
            h-px

            bg-gradient-to-r
            from-transparent
            via-white/[0.08]
            to-transparent
          "
        />

        <div
          className="
            relative
            z-10
            [transform:translateZ(12px)]
          "
        >
          {children}
        </div>
      </article>
    </div>
  );
};
