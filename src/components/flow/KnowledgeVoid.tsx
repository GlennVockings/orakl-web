"use client";

import { type ReactNode, useRef } from "react";

import { KnowledgeStream } from "./KnowledgeStream";

type KnowledgeVoidProps = {
  children: ReactNode;
};

export function KnowledgeVoid({ children }: KnowledgeVoidProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={containerRef}
      className="
        relative
        isolate
        overflow-hidden
        bg-background
      "
    >
      {/* Existing ambient background streams */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          text-primary
          opacity-40
        "
      >
        {/* Keep your existing background SVG here */}
      </div>

      <KnowledgeStream containerRef={containerRef} />

      <div className="relative z-10">{children}</div>
    </section>
  );
}
