
import type { DemoAchievementId } from "./achievements";

export type AchievementSnapshot = {
  playerId: string;
  correctPredictions: number;
  settledPredictions: number;
  currentStreak: number;
  bestStreak: number;
  totalEvents: number;
  completedEvents: number;
  currentRank: number;
  previousRank: number;
  competitorCount: number;
  rankHistory: readonly number[];
};

export type AchievementEvaluation = {
  eligible: DemoAchievementId[];
  newlyUnlocked: DemoAchievementId[];
};

export function getEligibleAchievements(
  snapshot: AchievementSnapshot,
): DemoAchievementId[] {
  const eligible: DemoAchievementId[] = [];

  const competitionComplete =
    snapshot.totalEvents > 0 &&
    snapshot.completedEvents === snapshot.totalEvents;

  if (snapshot.correctPredictions >= 1) {
    eligible.push("first-call");
  }

  if (snapshot.bestStreak >= 3) {
    eligible.push("on-a-roll");
  }

  if (
    competitionComplete &&
    snapshot.settledPredictions === snapshot.totalEvents &&
    snapshot.correctPredictions === snapshot.totalEvents
  ) {
    eligible.push("perfect-round");
  }

  const previouslyLast =
    snapshot.rankHistory.includes(snapshot.competitorCount);

  const reachedFirst =
    snapshot.currentRank === 1 &&
    snapshot.previousRank !== 1;

  if (previouslyLast && reachedFirst) {
    eligible.push("comeback-kid");
  }

  if (competitionComplete && snapshot.currentRank === 1) {
    eligible.push("sports-day-champion");
  }

  return eligible;
}

export function evaluateAchievements(
  snapshot: AchievementSnapshot,
  previouslyEarned: readonly DemoAchievementId[],
): AchievementEvaluation {
  const eligible = getEligibleAchievements(snapshot);
  const earned = new Set(previouslyEarned);

  return {
    eligible,
    newlyUnlocked: eligible.filter((id) => !earned.has(id)),
  };
}
