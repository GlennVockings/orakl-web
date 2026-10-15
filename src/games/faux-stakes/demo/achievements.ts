
export type DemoAchievementId =
  | "first-call"
  | "on-a-roll"
  | "perfect-round"
  | "comeback-kid"
  | "sports-day-champion";

export type DemoAchievementDefinition = {
  id: DemoAchievementId;
  gameId: "faux-stakes";
  name: string;
  description: string;
  criteria: string;
};

export type DemoEarnedAchievement = {
  achievementId: DemoAchievementId;
  playerId: string;
  unlockedAt: string;
  contextId: string;
};

export const DEMO_ACHIEVEMENTS: readonly DemoAchievementDefinition[] = [
  {
    id: "first-call",
    gameId: "faux-stakes",
    name: "First Call",
    description: "Your first correct prediction!",
    criteria: "Make one correct settled prediction.",
  },
  {
    id: "on-a-roll",
    gameId: "faux-stakes",
    name: "On a Roll",
    description: "Three correct predictions in a row.",
    criteria: "Reach a streak of three correct predictions.",
  },
  {
    id: "perfect-round",
    gameId: "faux-stakes",
    name: "Perfect Round",
    description: "You predicted every event correctly!",
    criteria:
      "Correctly predict all three events in the Sports Day.",
  },
  {
    id: "comeback-kid",
    gameId: "faux-stakes",
    name: "Comeback Kid",
    description: "From last place to first!",
    criteria:
      "Reach first place after previously being last during the competition.",
  },
  {
    id: "sports-day-champion",
    gameId: "faux-stakes",
    name: "Sports Day Champion",
    description: "You finished at the top of the leaderboard!",
    criteria:
      "Finish the Sports Day in first place after all events are complete.",
  },
];

export function getDemoAchievement(
  id: DemoAchievementId,
): DemoAchievementDefinition {
  const achievement = DEMO_ACHIEVEMENTS.find(
    (item) => item.id === id,
  );

  if (!achievement) {
    throw new Error(`Unknown achievement: ${id}`);
  }

  return achievement;
}
