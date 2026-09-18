import type { ReactNode } from "react";

import { KnowledgeCurrents } from "./KnowledgeCurrents";
import { MobileOraklNav } from "@/components/navigation/MobileOraklNav";

export type VoidVanishingPoint = {
  x: number;
  y: number;
};

type KnowledgeVoidProps = {
  children?: ReactNode;

  vanishingPoint?: VoidVanishingPoint;

  mobileVanishingX?: number;
};

export const KnowledgeVoid = ({
  children,
  vanishingPoint = {
    x: 0.8,
    y: 0.75,
  },
  mobileVanishingX = 0.5,
}: KnowledgeVoidProps) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507]">
      <KnowledgeCurrents
        vanishingPoint={vanishingPoint}
        mobileVanishingX={mobileVanishingX}
      />

      <MobileOraklNav />

      {children ? <div className="relative z-10">{children}</div> : null}
    </main>
  );
};
