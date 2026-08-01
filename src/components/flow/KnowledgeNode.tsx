import type { ReactNode } from "react";

import { StreamNode } from "./StreamNode";

type KnowledgeNodeProps = {
  children: ReactNode;
  side?: "left" | "right";
};

export function KnowledgeNode({
  children,
  side = "right",
}: KnowledgeNodeProps) {
  const contentOnRight = side === "right";

  return (
    <section
      data-knowledge-station
      className="
        group/station
        relative
        mx-auto
        flex
        min-h-[100svh]
        max-w-7xl
        items-center
        px-6
        py-24
        lg:px-8
        lg:py-32
      "
    >
      <div
        className={[
          "grid w-full gap-10 lg:items-center",
          contentOnRight
            ? "lg:grid-cols-[12rem_minmax(0,1fr)]"
            : "lg:grid-cols-[minmax(0,1fr)_12rem]",
        ].join(" ")}
      >
        {contentOnRight ? (
          <>
            <StreamRail side="right" />

            <StationContent>{children}</StationContent>
          </>
        ) : (
          <>
            <StationContent>{children}</StationContent>

            <StreamRail side="left" />
          </>
        )}
      </div>
    </section>
  );
}

type StationContentProps = {
  children: ReactNode;
};

function StationContent({ children }: StationContentProps) {
  return (
    <div
      data-knowledge-content
      className="
        min-w-0

        transition-[opacity,transform,filter]
        duration-700
        ease-out

        lg:translate-y-8
        lg:scale-[0.98]
        lg:opacity-20
        lg:blur-[1px]

        group-data-[active=true]/station:lg:translate-y-0
        group-data-[active=true]/station:lg:scale-100
        group-data-[active=true]/station:lg:opacity-100
        group-data-[active=true]/station:lg:blur-none

        motion-reduce:transition-none
        motion-reduce:lg:translate-y-0
        motion-reduce:lg:scale-100
        motion-reduce:lg:blur-none
      "
    >
      {children}
    </div>
  );
}

type StreamRailProps = {
  side: "left" | "right";
};

function StreamRail({ side }: StreamRailProps) {
  return (
    <div className="relative hidden min-h-40 self-stretch lg:block">
      <div
        data-knowledge-node
        className="
          absolute
          left-1/2
          top-1/2
          z-10
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <StreamNode />
      </div>

      <div
        data-knowledge-branch
        aria-hidden="true"
        className={[
          "absolute top-1/2 h-px -translate-y-1/2",
          "bg-primary/35",
          "transition-[background-color,opacity,transform]",
          "duration-500",
          "group-data-[active=true]/station:bg-primary/80",
          "group-data-[active=true]/station:opacity-100",
          side === "right"
            ? "left-1/2 right-[-2.5rem] origin-left"
            : "left-[-2.5rem] right-1/2 origin-right",
        ].join(" ")}
      />
    </div>
  );
}
