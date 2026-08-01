"use client";

import { useState } from "react";

import { KnowledgeVoid } from "@/components/flow/KnowledgeVoid";

import { GameShowcase } from "./GameShowcase";
import { HomeHero } from "./Hero";
import { PlatformSection } from "./PlatformSection";
import type { ActiveGame, HomeProduct } from "./home.types";
import { KnowledgeNode } from "../flow/KnowledgeNode";
import { HowItWorks } from "./HowItWorks";
import { HomeCta } from "./HomeCta";

export function HomeExperience() {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  const activeProduct: HomeProduct = activeGame ?? "platform";

  return (
    <div
      data-product={activeProduct}
      className="
        bg-home-wash
        transition-colors
        duration-500
      "
    >
      <HomeHero />

      <KnowledgeVoid>
        <KnowledgeNode side="right">
          <GameShowcase
            activeGame={activeGame}
            onActiveGameChange={setActiveGame}
          />
        </KnowledgeNode>

        <KnowledgeNode side="left">
          <HowItWorks />
        </KnowledgeNode>

        <KnowledgeNode side="right">
          <PlatformSection />
        </KnowledgeNode>

        <KnowledgeNode side="left">
          <HomeCta />
        </KnowledgeNode>
      </KnowledgeVoid>
    </div>
  );
}
