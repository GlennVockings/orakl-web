
import { describe, expect, it } from "vitest";

import {
  evaluateAchievements,
  getEligibleAchievements,
  type AchievementSnapshot,
} from "./achievement-rules";

const BASE_SNAPSHOT: AchievementSnapshot = {
  playerId: "visitor",
  correctPredictions: 0,
  settledPredictions: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalEvents: 3,
  completedEvents: 0,
  currentRank: 4,
  previousRank: 4,
  competitorCount: 4,
  rankHistory: [4],
};

function snapshot(
  overrides: Partial<AchievementSnapshot> = {},
): AchievementSnapshot {
  return {
    ...BASE_SNAPSHOT,
    ...overrides,
  };
}

describe("achievement eligibility", () => {
  it("does not award anything at the start", () => {
    expect(getEligibleAchievements(snapshot())).toEqual([]);
  });

  it("awards First Call after one correct prediction", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          correctPredictions: 1,
          settledPredictions: 1,
          completedEvents: 1,
          currentStreak: 1,
          bestStreak: 1,
        }),
      ),
    ).toContain("first-call");
  });

  it("does not award First Call for an incorrect prediction", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          settledPredictions: 1,
          completedEvents: 1,
        }),
      ),
    ).not.toContain("first-call");
  });

  it("awards On a Roll after three consecutive correct predictions", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          correctPredictions: 3,
          settledPredictions: 3,
          completedEvents: 3,
          currentStreak: 3,
          bestStreak: 3,
        }),
      ),
    ).toContain("on-a-roll");
  });

  it("uses best streak even after the current streak resets", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          totalEvents: 5,
          completedEvents: 4,
          correctPredictions: 3,
          settledPredictions: 4,
          currentStreak: 0,
          bestStreak: 3,
        }),
      ),
    ).toContain("on-a-roll");
  });

  it("does not award On a Roll for three nonconsecutive correct predictions", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          totalEvents: 4,
          completedEvents: 4,
          correctPredictions: 3,
          settledPredictions: 4,
          currentStreak: 1,
          bestStreak: 2,
        }),
      ),
    ).not.toContain("on-a-roll");
  });

  it("awards Perfect Round after predicting every event correctly", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          correctPredictions: 3,
          settledPredictions: 3,
          completedEvents: 3,
          currentStreak: 3,
          bestStreak: 3,
        }),
      ),
    ).toContain("perfect-round");
  });

  it("does not award Perfect Round before the competition ends", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          correctPredictions: 2,
          settledPredictions: 2,
          completedEvents: 2,
          currentStreak: 2,
          bestStreak: 2,
        }),
      ),
    ).not.toContain("perfect-round");
  });

  it("does not award Perfect Round when an event was missed", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          correctPredictions: 2,
          settledPredictions: 2,
          completedEvents: 3,
          currentStreak: 2,
          bestStreak: 2,
        }),
      ),
    ).not.toContain("perfect-round");
  });

  it("does not award Perfect Round when a prediction was wrong", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          correctPredictions: 2,
          settledPredictions: 3,
          completedEvents: 3,
          currentStreak: 1,
          bestStreak: 2,
        }),
      ),
    ).not.toContain("perfect-round");
  });

  it("awards Comeback Kid after climbing from last to first", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          completedEvents: 2,
          currentRank: 1,
          previousRank: 2,
          rankHistory: [4, 3, 2],
        }),
      ),
    ).toContain("comeback-kid");
  });

  it("does not require a direct jump from last to first", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          currentRank: 1,
          previousRank: 2,
          rankHistory: [4, 3, 2],
        }),
      ),
    ).toContain("comeback-kid");
  });

  it("does not award Comeback Kid without previously being last", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          currentRank: 1,
          previousRank: 2,
          rankHistory: [3, 2],
        }),
      ),
    ).not.toContain("comeback-kid");
  });

  it("does not award Comeback Kid while still in second place", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          currentRank: 2,
          previousRank: 3,
          rankHistory: [4, 3],
        }),
      ),
    ).not.toContain("comeback-kid");
  });

  it("does not repeatedly qualify Comeback Kid while staying first", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          currentRank: 1,
          previousRank: 1,
          rankHistory: [4, 3, 2, 1],
        }),
      ),
    ).not.toContain("comeback-kid");
  });

  it("awards Champion for a first-place finish", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          completedEvents: 3,
          currentRank: 1,
          previousRank: 2,
        }),
      ),
    ).toContain("sports-day-champion");
  });

  it("does not award Champion before the final event", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          completedEvents: 2,
          currentRank: 1,
          previousRank: 2,
        }),
      ),
    ).not.toContain("sports-day-champion");
  });

  it("does not award Champion for finishing second", () => {
    expect(
      getEligibleAchievements(
        snapshot({
          completedEvents: 3,
          currentRank: 2,
          previousRank: 1,
        }),
      ),
    ).not.toContain("sports-day-champion");
  });

  it("allows Champion without Comeback Kid", () => {
    const eligible = getEligibleAchievements(
      snapshot({
        completedEvents: 3,
        currentRank: 1,
        previousRank: 1,
        rankHistory: [2, 1, 1],
      }),
    );

    expect(eligible).toContain("sports-day-champion");
    expect(eligible).not.toContain("comeback-kid");
  });

  it("allows Comeback Kid before the competition finishes", () => {
    const eligible = getEligibleAchievements(
      snapshot({
        completedEvents: 2,
        currentRank: 1,
        previousRank: 2,
        rankHistory: [4, 2],
      }),
    );

    expect(eligible).toContain("comeback-kid");
    expect(eligible).not.toContain("sports-day-champion");
  });

  it("does not award completion achievements for an empty competition", () => {
    const eligible = getEligibleAchievements(
      snapshot({
        totalEvents: 0,
        completedEvents: 0,
        currentRank: 1,
        previousRank: 1,
      }),
    );

    expect(eligible).not.toContain("perfect-round");
    expect(eligible).not.toContain("sports-day-champion");
  });
});

describe("achievement evaluation", () => {
  it("returns newly unlocked achievements", () => {
    const result = evaluateAchievements(
      snapshot({
        correctPredictions: 1,
        settledPredictions: 1,
        completedEvents: 1,
        currentStreak: 1,
        bestStreak: 1,
      }),
      [],
    );

    expect(result.eligible).toContain("first-call");
    expect(result.newlyUnlocked).toEqual(["first-call"]);
  });

  it("does not award an achievement twice", () => {
    const result = evaluateAchievements(
      snapshot({
        correctPredictions: 1,
        settledPredictions: 1,
        completedEvents: 1,
        currentStreak: 1,
        bestStreak: 1,
      }),
      ["first-call"],
    );

    expect(result.eligible).toContain("first-call");
    expect(result.newlyUnlocked).toEqual([]);
  });

  it("only returns achievements not already earned", () => {
    const result = evaluateAchievements(
      snapshot({
        correctPredictions: 3,
        settledPredictions: 3,
        completedEvents: 3,
        currentStreak: 3,
        bestStreak: 3,
        currentRank: 1,
        previousRank: 2,
        rankHistory: [4, 3, 2],
      }),
      ["first-call", "on-a-roll"],
    );

    expect(result.newlyUnlocked).toEqual([
      "perfect-round",
      "comeback-kid",
      "sports-day-champion",
    ]);
  });

  it("does not mutate previously earned achievements", () => {
    const earned = ["first-call"] as const;

    evaluateAchievements(
      snapshot({
        correctPredictions: 3,
        settledPredictions: 3,
        completedEvents: 3,
        currentStreak: 3,
        bestStreak: 3,
      }),
      earned,
    );

    expect(earned).toEqual(["first-call"]);
  });

  it("returns consistent results for identical inputs", () => {
    const input = snapshot({
      correctPredictions: 3,
      settledPredictions: 3,
      completedEvents: 3,
      currentStreak: 3,
      bestStreak: 3,
      currentRank: 1,
      previousRank: 2,
      rankHistory: [4, 3, 2],
    });

    const first = evaluateAchievements(input, ["first-call"]);
    const second = evaluateAchievements(input, ["first-call"]);

    expect(first).toEqual(second);
  });
});
