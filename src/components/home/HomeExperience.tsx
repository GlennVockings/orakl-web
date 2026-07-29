"use client";

import { useState } from "react";

import { GameShowcase } from "./GameShowcase";
import { HomeHero } from "./Hero";
import { PlatformSection } from "./PlatformSection";
import type { ActiveGame, HomeProduct } from "./home.types";

export function HomeExperience() {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  const activeProduct: HomeProduct = activeGame ?? "platform";

  return (
    <div
      data-product={activeProduct}
      className="bg-home-wash transition-colors duration-300"
    >
      <HomeHero />

      <GameShowcase
        activeGame={activeGame}
        onActiveGameChange={setActiveGame}
      />

      <PlatformSection />
    </div>
  );
}