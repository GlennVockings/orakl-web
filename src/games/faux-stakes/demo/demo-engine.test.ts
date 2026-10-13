
import { describe, expect, it } from "vitest";

import {
  createInitialDemoState,
  demoReducer,
  formatDemoMoney,
  getDemoLeaderboard,
  getDemoPlayerStats,
  getDemoSummary,
  getEventOption,
  getOptionLabel,
  type DemoAction,
  type DemoMarket,
  type DemoState,
} from "./demo-engine";

import {
  DEMO_ACHIEVEMENTS,
  getDemoAchievement,
  type DemoAchievementId,
} from "./achievements";

const WINNERS: Record<string, string> = {
  sprint: "red",
  beanbag: "green",
  "tug-of-war": "blue",
};

function apply(
  state: DemoState,
  ...actions: DemoAction[]
): DemoState {
  return actions.reduce(demoReducer, state);
}

function placePrediction(
  state: DemoState,
  marketId: string,
  optionId: string,
  orakls = 100,
): DemoState {
  return demoReducer(state, {
    type: "PLACE_BET",
    marketId,
    optionId,
    stake: orakls * 100,
  });
}

function revealResult(
  state: DemoState,
  marketId: string,
): DemoState {
  return apply(
    state,
    { type: "LOCK_MARKET", marketId },
    { type: "SETTLE_MARKET", marketId },
  );
}

function getVisitor(state: DemoState) {
  const visitor = getDemoLeaderboard(state).find(
    (player) => player.isVisitor,
  );

  if (!visitor) {
    throw new Error("Demo visitor missing from leaderboard.");
  }

  return visitor;
}

function hasAchievement(
  state: DemoState,
  id: DemoAchievementId,
): boolean {
  return state.achievements.some(
    (achievement) => achievement.achievementId === id,
  );
}

function predictAllCorrectly(orakls = 100): DemoState {
  let state = createInitialDemoState();

  for (const [marketId, optionId] of Object.entries(WINNERS)) {
    state = placePrediction(state, marketId, optionId, orakls);
  }

  return state;
}

function completeSportsDay(state: DemoState): DemoState {
  for (const marketId of Object.keys(WINNERS)) {
    state = revealResult(state, marketId);
  }

  return state;
}

function createCustomEvent(
  options: DemoMarket["options"],
  winnerId: string,
): DemoMarket {
  return {
    id: "custom",
    title: "Custom Challenge",
    subtitle: "Test event",
    options,
    status: "open",
    winningOptionId: null,
    simulatedWinnerId: winnerId,
  };
}

describe("Faux Stakes — initial state", () => {
  it("starts with 1,000 Orakls", () => {
    const state = createInitialDemoState();

    expect(state.initialBalance).toBe(100_000);
    expect(state.balance).toBe(100_000);
    expect(getVisitor(state).balance).toBe(100_000);
  });

  it("starts with three open events", () => {
    const state = createInitialDemoState();

    expect(state.markets).toHaveLength(3);
    expect(
      state.markets.every(
        (market) =>
          market.status === "open" &&
          market.winningOptionId === null,
      ),
    ).toBe(true);
  });

  it("starts with four competitors and nine opponent predictions", () => {
    const state = createInitialDemoState();

    expect(state.players).toHaveLength(4);
    expect(state.opponentBets).toHaveLength(9);
  });

  it("starts with empty visitor activity", () => {
    const state = createInitialDemoState();

    expect(state.bets).toEqual([]);
    expect(state.transactions).toEqual([]);
    expect(state.achievements).toEqual([]);
    expect(state.settlementOrder).toEqual([]);
  });

  it("records the initial visitor ranking", () => {
    const state = createInitialDemoState();

    expect(state.rankHistory).toEqual([getVisitor(state).rank]);
  });

  it("creates independent event options for each state instance", () => {
    const first = createInitialDemoState();
    const second = createInitialDemoState();

    first.markets[0].options[0].rewardMultiplier = 999;

    expect(second.markets[0].options[0].rewardMultiplier).toBe(2);
  });
});

describe("Faux Stakes — generic event options", () => {
  it("uses stable option IDs instead of football outcomes", () => {
    const state = createInitialDemoState();
    const sprint = state.markets[0];

    expect(sprint.options.map((option) => option.id)).toEqual([
      "red",
      "blue",
      "green",
    ]);

    expect(sprint.simulatedWinnerId).toBe("red");
  });

  it("resolves an option from its event", () => {
    const sprint = createInitialDemoState().markets[0];

    expect(getEventOption(sprint, "blue")).toMatchObject({
      id: "blue",
      label: "Blue Team",
      rewardMultiplier: 3,
    });

    expect(getOptionLabel(sprint, "green")).toBe("Green Team");
  });

  it("does not resolve options belonging to another event", () => {
    const event = createCustomEvent(
      [
        { id: "yes", label: "Yes", rewardMultiplier: 2 },
        { id: "no", label: "No", rewardMultiplier: 2 },
      ],
      "yes",
    );

    expect(getEventOption(event, "red")).toBeUndefined();
    expect(getOptionLabel(event, "red")).toBe("Unknown option");
  });

  it("supports a two-option event", () => {
    const event = createCustomEvent(
      [
        { id: "yes", label: "Yes", rewardMultiplier: 1.5 },
        { id: "no", label: "No", rewardMultiplier: 2.5 },
      ],
      "yes",
    );

    const state = {
      ...createInitialDemoState(),
      markets: [event],
    };

    const predicted = placePrediction(state, "custom", "yes", 100);

    expect(predicted.bets).toHaveLength(1);
    expect(predicted.bets[0].multiplier).toBe(1.5);

    const settled = revealResult(predicted, "custom");

    expect(settled.markets[0].winningOptionId).toBe("yes");
    expect(settled.bets[0].payout).toBe(15_000);
  });

  it("supports a four-option event", () => {
    const event = createCustomEvent(
      [
        { id: "a", label: "A", rewardMultiplier: 2 },
        { id: "b", label: "B", rewardMultiplier: 3 },
        { id: "c", label: "C", rewardMultiplier: 4 },
        { id: "d", label: "D", rewardMultiplier: 5 },
      ],
      "d",
    );

    const state = {
      ...createInitialDemoState(),
      markets: [event],
    };

    const predicted = placePrediction(state, "custom", "d", 100);
    const settled = revealResult(predicted, "custom");

    expect(predicted.bets[0].optionId).toBe("d");
    expect(settled.bets[0].payout).toBe(50_000);
  });

  it("rejects an option not belonging to the selected event", () => {
    const initial = createInitialDemoState();

    const state = placePrediction(
      initial,
      "sprint",
      "chocolate",
      100,
    );

    expect(state.bets).toEqual([]);
    expect(state.balance).toBe(100_000);
    expect(state.message).toMatch(/not available/i);
  });

  it("rejects an empty option ID", () => {
    const state = placePrediction(
      createInitialDemoState(),
      "sprint",
      "",
    );

    expect(state.bets).toEqual([]);
  });

  it("rejects a case-mismatched option ID", () => {
    const state = placePrediction(
      createInitialDemoState(),
      "sprint",
      "RED",
    );

    expect(state.bets).toEqual([]);
  });

  it("keeps option IDs unique within every initial event", () => {
    const state = createInitialDemoState();

    for (const market of state.markets) {
      const ids = market.options.map((option) => option.id);

      expect(new Set(ids).size).toBe(ids.length);
      expect(market.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("ensures every simulated winner belongs to its event", () => {
    const state = createInitialDemoState();

    for (const market of state.markets) {
      expect(
        getEventOption(market, market.simulatedWinnerId),
      ).toBeDefined();
    }
  });

  it("ensures every opponent prediction uses a valid event option", () => {
    const state = createInitialDemoState();

    for (const bet of state.opponentBets) {
      const market = state.markets.find(
        (item) => item.id === bet.marketId,
      );

      expect(market).toBeDefined();
      expect(
        market && getEventOption(market, bet.optionId),
      ).toBeDefined();
    }
  });
});

describe("Faux Stakes — predictions and wallet", () => {
  it("deducts committed Orakls", () => {
    const state = placePrediction(
      createInitialDemoState(),
      "sprint",
      "red",
      200,
    );

    expect(state.balance).toBe(80_000);
    expect(state.bets[0]).toMatchObject({
      marketId: "sprint",
      optionId: "red",
      stake: 20_000,
      multiplier: 2,
      payout: null,
    });
  });

  it("keeps the competition score unchanged while a prediction is active", () => {
    const initial = createInitialDemoState();
    const initialScore = getVisitor(initial).score;

    const state = placePrediction(
      initial,
      "sprint",
      "red",
      200,
    );

    expect(getVisitor(state).score).toBe(initialScore);
    expect(getVisitor(state).activeStake).toBe(20_000);
  });

  it("records the commitment in wallet activity", () => {
    const state = placePrediction(
      createInitialDemoState(),
      "sprint",
      "red",
    );

    expect(state.transactions[0].amount).toBe(-10_000);
    expect(state.transactions[0].balance).toBe(90_000);
  });

  it("rejects insufficient Orakls", () => {
    const state = placePrediction(
      createInitialDemoState(),
      "sprint",
      "red",
      1_001,
    );

    expect(state.bets).toEqual([]);
    expect(state.balance).toBe(100_000);
  });

  it.each([0, -100, 1.5, NaN, Infinity])(
    "rejects invalid minor-unit commitment %s",
    (stake) => {
      const state = demoReducer(createInitialDemoState(), {
        type: "PLACE_BET",
        marketId: "sprint",
        optionId: "red",
        stake,
      });

      expect(state.bets).toEqual([]);
      expect(state.balance).toBe(100_000);
    },
  );

  it("rejects duplicate predictions", () => {
    const first = placePrediction(
      createInitialDemoState(),
      "sprint",
      "red",
    );

    const second = placePrediction(
      first,
      "sprint",
      "green",
    );

    expect(second.bets).toHaveLength(1);
    expect(second.bets[0].optionId).toBe("red");
    expect(second.balance).toBe(first.balance);
  });

  it("increases an existing commitment", () => {
    const initial = placePrediction(
      createInitialDemoState(),
      "sprint",
      "red",
    );

    const state = demoReducer(initial, {
      type: "EDIT_BET",
      marketId: "sprint",
      stake: 20_000,
    });

    expect(state.bets).toHaveLength(1);
    expect(state.bets[0].stake).toBe(20_000);
    expect(state.balance).toBe(80_000);
  });

  it("returns the difference when reducing a commitment", () => {
    const initial = placePrediction(
      createInitialDemoState(),
      "sprint",
      "red",
      200,
    );

    const state = demoReducer(initial, {
      type: "EDIT_BET",
      marketId: "sprint",
      stake: 5_000,
    });

    expect(state.balance).toBe(95_000);
    expect(state.transactions[0].amount).toBe(15_000);
  });

  it("does not permit an edit beyond the available balance", () => {
    const initial = placePrediction(
      createInitialDemoState(),
      "sprint",
      "red",
    );

    const state = demoReducer(initial, {
      type: "EDIT_BET",
      marketId: "sprint",
      stake: 110_000,
    });

    expect(state.bets[0].stake).toBe(10_000);
    expect(state.balance).toBe(90_000);
  });

  it("does not create a transaction for an unchanged commitment", () => {
    const initial = placePrediction(
      createInitialDemoState(),
      "sprint",
      "red",
    );

    const state = demoReducer(initial, {
      type: "EDIT_BET",
      marketId: "sprint",
      stake: 10_000,
    });

    expect(state.transactions).toHaveLength(1);
  });

  it("returns committed Orakls when removing a prediction", () => {
    const initial = placePrediction(
      createInitialDemoState(),
      "sprint",
      "red",
      200,
    );

    const state = demoReducer(initial, {
      type: "REMOVE_BET",
      marketId: "sprint",
    });

    expect(state.balance).toBe(100_000);
    expect(state.bets).toEqual([]);
    expect(state.transactions[0].amount).toBe(20_000);
  });
});

describe("Faux Stakes — event settlement", () => {
  it("closes an event", () => {
    const state = demoReducer(createInitialDemoState(), {
      type: "LOCK_MARKET",
      marketId: "sprint",
    });

    expect(state.markets[0].status).toBe("locked");
  });

  it("does not allow predictions after closing", () => {
    const locked = demoReducer(createInitialDemoState(), {
      type: "LOCK_MARKET",
      marketId: "sprint",
    });

    const state = placePrediction(locked, "sprint", "red");

    expect(state.bets).toEqual([]);
  });

  it("does not allow edits or removal after closing", () => {
    const initial = placePrediction(
      createInitialDemoState(),
      "sprint",
      "red",
    );

    const locked = demoReducer(initial, {
      type: "LOCK_MARKET",
      marketId: "sprint",
    });

    const edited = demoReducer(locked, {
      type: "EDIT_BET",
      marketId: "sprint",
      stake: 20_000,
    });

    const removed = demoReducer(locked, {
      type: "REMOVE_BET",
      marketId: "sprint",
    });

    expect(edited.bets).toEqual(locked.bets);
    expect(removed.bets).toEqual(locked.bets);
  });

  it("requires closing before revealing a result", () => {
    const state = demoReducer(createInitialDemoState(), {
      type: "SETTLE_MARKET",
      marketId: "sprint",
    });

    expect(state.markets[0].status).toBe("open");
    expect(state.settlementOrder).toEqual([]);
  });

  it("settles the correct event option", () => {
    const state = revealResult(
      createInitialDemoState(),
      "sprint",
    );

    expect(state.markets[0].winningOptionId).toBe("red");
    expect(state.markets[0].status).toBe("settled");
  });

  it("does not settle an event twice", () => {
    const settled = revealResult(
      createInitialDemoState(),
      "sprint",
    );

    const again = demoReducer(settled, {
      type: "SETTLE_MARKET",
      marketId: "sprint",
    });

    expect(again.settlementOrder).toEqual(["sprint"]);
    expect(again.players).toEqual(settled.players);
  });

  it("returns the correct reward", () => {
    const initial = placePrediction(
      createInitialDemoState(),
      "sprint",
      "red",
      200,
    );

    const state = revealResult(initial, "sprint");

    expect(state.bets[0].payout).toBe(40_000);
    expect(state.balance).toBe(120_000);
    expect(getDemoSummary(state).netProfit).toBe(20_000);
  });

  it("returns no reward for an incorrect prediction", () => {
    const initial = placePrediction(
      createInitialDemoState(),
      "sprint",
      "green",
      200,
    );

    const state = revealResult(initial, "sprint");

    expect(state.bets[0].payout).toBe(0);
    expect(state.balance).toBe(80_000);
    expect(getDemoSummary(state).netProfit).toBe(-20_000);
  });

  it("excludes unfinished predictions from net change", () => {
    let state = createInitialDemoState();

    state = placePrediction(state, "sprint", "red", 100);
    state = placePrediction(state, "beanbag", "green", 200);

    expect(getDemoSummary(state).netProfit).toBe(0);

    state = revealResult(state, "sprint");

    expect(getDemoSummary(state).netProfit).toBe(10_000);
    expect(getDemoSummary(state).activeBets).toBe(1);
  });

  it("settles opponent predictions using option IDs", () => {
    const state = revealResult(
      createInitialDemoState(),
      "sprint",
    );

    const sam = state.opponentBets.find(
      (bet) =>
        bet.playerId === "sam" &&
        bet.marketId === "sprint",
    );

    const alex = state.opponentBets.find(
      (bet) =>
        bet.playerId === "alex" &&
        bet.marketId === "sprint",
    );

    expect(sam?.payout).toBe(40_000);
    expect(alex?.payout).toBe(0);
  });

  it("does not settle when the winning option is invalid", () => {
    const initial = createInitialDemoState();

    const invalid = {
      ...initial,
      markets: initial.markets.map((market) =>
        market.id === "sprint"
          ? {
              ...market,
              simulatedWinnerId: "missing",
            }
          : market,
      ),
    };

    const locked = demoReducer(invalid, {
      type: "LOCK_MARKET",
      marketId: "sprint",
    });

    const result = demoReducer(locked, {
      type: "SETTLE_MARKET",
      marketId: "sprint",
    });

    expect(result.settlementOrder).toEqual([]);
    expect(result.markets[0].status).toBe("locked");
  });
});

describe("Faux Stakes — performance and leaderboard", () => {
  it("counts predictions independently of committed Orakls", () => {
    const small = revealResult(
      placePrediction(
        createInitialDemoState(),
        "sprint",
        "red",
        1,
      ),
      "sprint",
    );

    const large = revealResult(
      placePrediction(
        createInitialDemoState(),
        "sprint",
        "red",
        500,
      ),
      "sprint",
    );

    expect(getDemoSummary(small).correct).toBe(1);
    expect(getDemoSummary(large).correct).toBe(1);
  });

  it("calculates accuracy using settled predictions", () => {
    let state = createInitialDemoState();

    state = placePrediction(state, "sprint", "red");
    state = placePrediction(state, "beanbag", "red");

    state = revealResult(state, "sprint");
    state = revealResult(state, "beanbag");

    expect(getDemoSummary(state).accuracy).toBe(50);
  });

  it("tracks three consecutive correct predictions", () => {
    const state = completeSportsDay(predictAllCorrectly());

    expect(getDemoSummary(state)).toMatchObject({
      correct: 3,
      settled: 3,
      accuracy: 100,
      currentStreak: 3,
      bestStreak: 3,
    });
  });

  it("resets the current streak after an incorrect prediction", () => {
    let state = createInitialDemoState();

    state = placePrediction(state, "sprint", "red");
    state = placePrediction(state, "beanbag", "red");
    state = placePrediction(state, "tug-of-war", "blue");

    state = completeSportsDay(state);

    expect(getDemoSummary(state).currentStreak).toBe(1);
    expect(getDemoSummary(state).bestStreak).toBe(1);
  });

  it("uses settlement order for streaks and latest results", () => {
    let state = predictAllCorrectly();

    state = revealResult(state, "tug-of-war");
    state = revealResult(state, "sprint");
    state = revealResult(state, "beanbag");

    expect(state.settlementOrder).toEqual([
      "tug-of-war",
      "sprint",
      "beanbag",
    ]);

    expect(getDemoSummary(state).currentStreak).toBe(3);
    expect(getDemoSummary(state).latestResult?.marketId).toBe(
      "beanbag",
    );
  });

  it("reports the latest correct or incorrect prediction", () => {
    let state = createInitialDemoState();

    state = placePrediction(state, "sprint", "red");
    state = placePrediction(state, "beanbag", "red");

    state = revealResult(state, "beanbag");

    expect(getVisitor(state).latestResult).toEqual({
      marketId: "beanbag",
      correct: false,
      netChange: -10_000,
    });

    state = revealResult(state, "sprint");

    expect(getVisitor(state).latestResult).toEqual({
      marketId: "sprint",
      correct: true,
      netChange: 10_000,
    });
  });

  it("sorts competitors by score and assigns ranks", () => {
    const leaderboard = getDemoLeaderboard(
      createInitialDemoState(),
    );

    expect(leaderboard.map((player) => player.rank)).toEqual([
      1, 2, 3, 4,
    ]);

    const scores = leaderboard.map((player) => player.score);

    expect(scores).toEqual(
      [...scores].sort((a, b) => b - a),
    );
  });

  it("tracks rank history after settlement", () => {
    let state = predictAllCorrectly(200);

    const initialLength = state.rankHistory.length;

    state = revealResult(state, "sprint");
    state = revealResult(state, "beanbag");

    expect(state.rankHistory).toHaveLength(initialLength + 2);
    expect(state.rankHistory.at(-1)).toBe(
      getVisitor(state).rank,
    );
  });

  it("returns empty stats for an unknown player", () => {
    const stats = getDemoPlayerStats(
      createInitialDemoState(),
      "unknown",
    );

    expect(stats.correct).toBe(0);
    expect(stats.latestResult).toBeNull();
  });
});

describe("Faux Stakes — achievements", () => {
  it("has unique achievement identifiers", () => {
    const ids = DEMO_ACHIEVEMENTS.map(
      (achievement) => achievement.id,
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves every achievement definition", () => {
    for (const achievement of DEMO_ACHIEVEMENTS) {
      expect(getDemoAchievement(achievement.id)).toEqual(
        achievement,
      );
    }
  });

  it("unlocks First Call after a correct prediction", () => {
    const state = revealResult(
      placePrediction(
        createInitialDemoState(),
        "sprint",
        "red",
      ),
      "sprint",
    );

    expect(hasAchievement(state, "first-call")).toBe(true);
  });

  it("does not unlock First Call for an incorrect prediction", () => {
    const state = revealResult(
      placePrediction(
        createInitialDemoState(),
        "sprint",
        "green",
      ),
      "sprint",
    );

    expect(hasAchievement(state, "first-call")).toBe(false);
  });

  it("unlocks On a Roll after three correct predictions", () => {
    const state = completeSportsDay(predictAllCorrectly());

    expect(hasAchievement(state, "on-a-roll")).toBe(true);
  });

  it("unlocks Perfect Round after all three correct results", () => {
    const state = completeSportsDay(predictAllCorrectly());

    expect(hasAchievement(state, "perfect-round")).toBe(true);
  });

  it("does not unlock Perfect Round before the final result", () => {
    let state = predictAllCorrectly();

    state = revealResult(state, "sprint");
    state = revealResult(state, "beanbag");

    expect(hasAchievement(state, "perfect-round")).toBe(false);
  });

  it("unlocks Sports Day Champion for a first-place finish", () => {
    const state = completeSportsDay(predictAllCorrectly(200));

    expect(getVisitor(state).rank).toBe(1);
    expect(hasAchievement(state, "sports-day-champion")).toBe(
      true,
    );
  });

  it("does not unlock Champion before the final result", () => {
    let state = predictAllCorrectly(200);

    state = revealResult(state, "sprint");
    state = revealResult(state, "beanbag");

    expect(
      hasAchievement(state, "sports-day-champion"),
    ).toBe(false);
  });

  it("unlocks Comeback Kid after moving from last to first", () => {
    const state = completeSportsDay(predictAllCorrectly(200));

    expect(state.rankHistory).toContain(state.players.length);
    expect(getVisitor(state).rank).toBe(1);
    expect(hasAchievement(state, "comeback-kid")).toBe(true);
  });

  it("does not duplicate achievements", () => {
    const state = completeSportsDay(predictAllCorrectly(200));

    const ids = state.achievements.map(
      (achievement) => achievement.achievementId,
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("preserves earned achievements when notifications are dismissed", () => {
    const unlocked = revealResult(
      placePrediction(
        createInitialDemoState(),
        "sprint",
        "red",
      ),
      "sprint",
    );

    const dismissed = demoReducer(unlocked, {
      type: "DISMISS_ACHIEVEMENTS",
    });

    expect(dismissed.newAchievements).toEqual([]);
    expect(hasAchievement(dismissed, "first-call")).toBe(true);
  });
});

describe("Faux Stakes — restart and utilities", () => {
  it("resets the entire competition", () => {
    const completed = completeSportsDay(
      predictAllCorrectly(200),
    );

    const restarted = demoReducer(completed, {
      type: "RESET",
    });

    expect(restarted).toEqual(createInitialDemoState());
  });

  it("clears messages without changing predictions", () => {
    const state = placePrediction(
      createInitialDemoState(),
      "sprint",
      "red",
    );

    const cleared = demoReducer(state, {
      type: "CLEAR_MESSAGE",
    });

    expect(cleared.message).toBeNull();
    expect(cleared.bets).toEqual(state.bets);
    expect(cleared.balance).toBe(state.balance);
  });

  it("formats whole, fractional and negative Orakls", () => {
    expect(formatDemoMoney(100_000)).toBe("1,000 Orakls");
    expect(formatDemoMoney(12_345)).toBe("123.45 Orakls");
    expect(formatDemoMoney(-10_000)).toBe("-100 Orakls");
  });
});
