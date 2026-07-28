"use client";

import type { CSSProperties, ReactNode } from "react";

type HomeExperienceProps = {
  activeColour: string;
  children: ReactNode;
};

type HomeExperienceStyle = CSSProperties & {
  "--active-game-colour": string;
};

export function HomeExperience({
  activeColour,
  children,
}: HomeExperienceProps) {
  const style: HomeExperienceStyle = {
    "--active-game-colour": activeColour,
  };

  return <div style={style}>{children}</div>;
}