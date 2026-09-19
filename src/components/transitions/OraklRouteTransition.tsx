"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { animate } from "animejs";

type OraklRouteTransitionContextValue = {
  registerScene: (scene: HTMLElement | null) => void;
};

type VoidRouteTravelDetail = {
  phase: "exit" | "enter";
  direction: -1 | 1;
};

const OraklRouteTransitionContext =
  createContext<OraklRouteTransitionContextValue | null>(null);

type OraklRouteTransitionProps = {
  children: ReactNode;
};

const PRIMARY_ROUTES = [
  "/",
  "/games/faux-stakes",
  "/games/predictor",
  "/games/arena",
  "/auth",
];

const ROUTE_ORDER = new Map(
  PRIMARY_ROUTES.map((route, index) => [route, index]),
);

const VOID_ROUTE_TRAVEL_EVENT = "orakl:void-route-travel";

const DESKTOP_EXIT_DURATION = 520;
const DESKTOP_ENTER_DURATION = 440;
const DESKTOP_ROUTE_SWAP_AT = 500;

const MOBILE_EXIT_DURATION = 300;
const MOBILE_ENTER_DURATION = 300;
const MOBILE_ROUTE_SWAP_AT = 285;

const MOBILE_BREAKPOINT = 768;

function dispatchVoidTravel(detail: VoidRouteTravelDetail) {
  window.dispatchEvent(
    new CustomEvent<VoidRouteTravelDetail>(VOID_ROUTE_TRAVEL_EVENT, { detail }),
  );
}

function getRouteDirection(
  currentPath: string,
  destinationPath: string,
): -1 | 1 {
  const currentIndex = ROUTE_ORDER.get(currentPath);
  const destinationIndex = ROUTE_ORDER.get(destinationPath);

  if (
    currentIndex !== undefined &&
    destinationIndex !== undefined &&
    currentIndex !== destinationIndex
  ) {
    return destinationIndex > currentIndex ? 1 : -1;
  }

  return 1;
}

function getHistoryDirection(): -1 | 1 {
  const currentIndex = Number(window.history.state?.__oraklIndex) || 0;

  const previousIndex =
    Number(sessionStorage.getItem("orakl-history-index")) || 0;

  return currentIndex < previousIndex ? -1 : 1;
}

function rememberHistoryIndex() {
  const state = window.history.state ?? {};

  if (typeof state.__oraklIndex !== "number") {
    const previousIndex =
      Number(sessionStorage.getItem("orakl-history-index")) || 0;

    window.history.replaceState(
      {
        ...state,
        __oraklIndex: previousIndex,
      },
      "",
      window.location.href,
    );
  }

  sessionStorage.setItem(
    "orakl-history-index",
    String(Number(window.history.state?.__oraklIndex) || 0),
  );
}

function focusRouteHeading(scene: HTMLElement) {
  const heading = scene.querySelector<HTMLElement>("h1");

  if (!heading) {
    return;
  }

  const hadTabIndex = heading.hasAttribute("tabindex");

  if (!hadTabIndex) {
    heading.setAttribute("tabindex", "-1");
  }

  heading.focus({
    preventScroll: true,
  });

  if (!hadTabIndex) {
    heading.addEventListener(
      "blur",
      () => {
        heading.removeAttribute("tabindex");
      },
      {
        once: true,
      },
    );
  }
}

function getSceneCards(scene: HTMLElement) {
  return Array.from(
    scene.querySelectorAll<HTMLElement>("[data-orakl-travel-object]"),
  ).filter((card) => {
    const rect = card.getBoundingClientRect();

    return (
      rect.bottom > 0 &&
      rect.top < window.innerHeight &&
      rect.right > 0 &&
      rect.left < window.innerWidth
    );
  });
}
function setNavigationBusy(busy: boolean) {
  if (busy) {
    document.documentElement.setAttribute("aria-busy", "true");
    return;
  }

  document.documentElement.removeAttribute("aria-busy");
}

function resetSceneCards(cards: HTMLElement[]) {
  cards.forEach((card) => {
    card.style.opacity = "";
    card.style.filter = "";
    card.style.transform = "";
    card.style.transformOrigin = "";
  });
}

export const OraklRouteTransition = ({
  children,
}: OraklRouteTransitionProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const sceneRef = useRef<HTMLElement | null>(null);
  const travellingRef = useRef(false);
  const pendingPathRef = useRef<string | null>(null);
  const directionRef = useRef<-1 | 1>(1);
  const initialRouteRef = useRef(true);
  const browserNavigationRef = useRef(false);

  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  const [routeVersion, setRouteVersion] = useState(0);

  const registerScene = useCallback((scene: HTMLElement | null) => {
    sceneRef.current = scene;
  }, []);

  useEffect(() => {
    rememberHistoryIndex();

    const handlePopState = () => {
      browserNavigationRef.current = true;
      directionRef.current = getHistoryDirection();

      sessionStorage.setItem(
        "orakl-history-index",
        String(Number(window.history.state?.__oraklIndex) || 0),
      );
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    PRIMARY_ROUTES.forEach((route) => {
      router.prefetch(route);
    });
  }, [router]);

  useEffect(() => {
    const prefetchInternalLink = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      router.prefetch(destination.pathname + destination.search);
    };

    document.addEventListener("pointerover", prefetchInternalLink, true);
    document.addEventListener("focusin", prefetchInternalLink, true);

    return () => {
      document.removeEventListener("pointerover", prefetchInternalLink, true);
      document.removeEventListener("focusin", prefetchInternalLink, true);
    };
  }, [router]);

  useEffect(() => {
    setRouteVersion((version) => version + 1);
  }, [pathname]);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) {
      travellingRef.current = false;
      pendingPathRef.current = null;
      setNavigationBusy(false);
      return;
    }

    if (initialRouteRef.current) {
      initialRouteRef.current = false;
      scene.style.opacity = "1";
      scene.style.transform = "";
      scene.style.filter = "";
      setNavigationBusy(false);
      return;
    }

    if (browserNavigationRef.current) {
      browserNavigationRef.current = false;
      travellingRef.current = true;

      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        dispatchVoidTravel({
          phase: "enter",
          direction: directionRef.current,
        });
      }
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      scene.style.opacity = "1";
      scene.style.transform = "";
      scene.style.filter = "";
      resetSceneCards(getSceneCards(scene));

      travellingRef.current = false;
      pendingPathRef.current = null;
      setNavigationBusy(false);
      focusRouteHeading(scene);
      return;
    }

    const mobile = window.innerWidth < MOBILE_BREAKPOINT;

    animationRef.current?.cancel();

    if (!mobile && travellingRef.current) {
      dispatchVoidTravel({
        phase: "enter",
        direction: directionRef.current,
      });
    }

    const cards = getSceneCards(scene);

    /*
     * 3.7c:
     * Keep the page itself in the Void. The glass objects are
     * what emerge from depth toward the observer.
     */
    if (cards.length === 0) {
      travellingRef.current = false;
      pendingPathRef.current = null;
      setNavigationBusy(false);
      focusRouteHeading(scene);
      return;
    }

    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transformOrigin = "center center";

      if (!mobile) {
        card.style.filter = "blur(6px)";
      }

      animate(card, {
        opacity: [0, 1],
        translateX: mobile ? [28, 0] : [directionRef.current * 34, 0],
        translateY: mobile ? [6, 0] : [12, 0],
        scale: mobile ? [0.94, 1] : [0.84, 1],
        ...(mobile
          ? {}
          : {
              filter: ["blur(6px)", "blur(0px)"],
            }),
        delay: index * (mobile ? 22 : 30),
        duration: mobile ? MOBILE_ENTER_DURATION : DESKTOP_ENTER_DURATION,
        ease: "out(4)",
        onComplete: () => {
          card.style.opacity = "";
          card.style.filter = "";
          card.style.transform = "";
          card.style.transformOrigin = "";

          if (index === cards.length - 1) {
            travellingRef.current = false;
            pendingPathRef.current = null;
            setNavigationBusy(false);
            focusRouteHeading(scene);
          }
        },
      });
    });

    return () => {
      animationRef.current?.cancel();
      animationRef.current = null;
    };
  }, [routeVersion]);

  useEffect(() => {
    const handleClick = (event: globalThis.MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");

      if (!anchor) {
        return;
      }

      if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);

      if (destination.origin !== window.location.origin) {
        return;
      }

      const current = new URL(window.location.href);

      if (
        destination.pathname === current.pathname &&
        destination.search === current.search
      ) {
        return;
      }

      if (travellingRef.current) {
        event.preventDefault();
        return;
      }

      const scene = sceneRef.current;

      if (!scene) {
        return;
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        return;
      }

      event.preventDefault();

      travellingRef.current = true;
      setNavigationBusy(true);

      pendingPathRef.current =
        destination.pathname + destination.search + destination.hash;

      directionRef.current = getRouteDirection(
        current.pathname,
        destination.pathname,
      );

      const mobile = window.innerWidth < MOBILE_BREAKPOINT;

      animationRef.current?.cancel();

      if (!mobile) {
        dispatchVoidTravel({
          phase: "exit",
          direction: directionRef.current,
        });
      }

      const cards = getSceneCards(scene);

      /*
       * Fly past the actual glass objects instead of treating
       * the entire route as one flat sheet.
       *
       * Desktop follows route direction. Mobile always exits
       * left while scaling toward the camera.
       */
      cards.forEach((card, index) => {
        card.style.transformOrigin = "center center";

        animate(card, {
          opacity: [1, 1],
          scale: mobile ? [1, 2.4] : [1, 3.6],
          translateX: mobile
            ? [0, -72]
            : [0, directionRef.current === 1 ? -110 : 110],
          translateY: mobile ? [0, -12] : [0, -28],
          ...(mobile
            ? {}
            : {
                filter: ["blur(0px)", "blur(2px)"],
              }),
          delay: index * (mobile ? 14 : 22),
          duration: mobile ? MOBILE_EXIT_DURATION : DESKTOP_EXIT_DURATION,
          ease: "in(4)",
        });
      });

      window.setTimeout(
        () => {
          const pendingPath = pendingPathRef.current;

          if (!pendingPath) {
            return;
          }

          const currentIndex =
            Number(sessionStorage.getItem("orakl-history-index")) || 0;

          const nextIndex = currentIndex + 1;

          sessionStorage.setItem("orakl-history-index", String(nextIndex));

          window.history.replaceState(
            {
              ...(window.history.state ?? {}),
              __oraklIndex: currentIndex,
            },
            "",
            window.location.href,
          );

          router.push(pendingPath);

          /*
           * Next owns the new history entry. Stamp it after the
           * push has had a chance to create that entry so browser
           * back/forward can infer travel direction.
           */
          window.setTimeout(() => {
            window.history.replaceState(
              {
                ...(window.history.state ?? {}),
                __oraklIndex: nextIndex,
              },
              "",
              window.location.href,
            );
          }, 0);
        },
        mobile ? MOBILE_ROUTE_SWAP_AT : DESKTOP_ROUTE_SWAP_AT,
      );
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname, router]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        return;
      }

      animationRef.current?.cancel();
      animationRef.current = null;

      const scene = sceneRef.current;

      if (scene) {
        scene.style.opacity = "1";
        scene.style.transform = "";
        scene.style.filter = "";
        resetSceneCards(getSceneCards(scene));
      }

      travellingRef.current = false;
      pendingPathRef.current = null;
      setNavigationBusy(false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      animationRef.current?.cancel();
      setNavigationBusy(false);
    };
  }, []);

  return (
    <OraklRouteTransitionContext.Provider
      value={{
        registerScene,
      }}
    >
      {children}
    </OraklRouteTransitionContext.Provider>
  );
};

export const useOraklRouteScene = () => {
  const context = useContext(OraklRouteTransitionContext);

  return context?.registerScene ?? null;
};
