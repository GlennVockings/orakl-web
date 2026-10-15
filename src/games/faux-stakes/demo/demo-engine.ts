
import {
  type DemoAchievementId,
  type DemoEarnedAchievement,
} from "./achievements";

import { evaluateAchievements } from "./achievement-rules";

export type DemoMarketStatus = "open" | "locked" | "settled";

export type DemoEventOption = {
  id: string;
  label: string;
  rewardMultiplier: number;
  color?: "red" | "blue" | "green" | "neutral";
};

export type DemoMarket = {
  id: string;
  title: string;
  subtitle: string;
  options: DemoEventOption[];
  status: DemoMarketStatus;
  winningOptionId: string | null;
  simulatedWinnerId: string;
};

export type DemoBet = {
  marketId: string;
  optionId: string;
  stake: number;
  multiplier: number;
  payout: number | null;
};

export type DemoPlayer = {
  id: string;
  name: string;
  balance: number;
  isVisitor?: boolean;
};

export type DemoOpponentBet = DemoBet & {
  playerId: string;
};

export type DemoTransaction = {
  id: number;
  description: string;
  amount: number;
  balance: number;
};

export type DemoPredictionResult = {
  marketId: string;
  correct: boolean;
  netChange: number;
};

export type DemoPlayerStats = {
  correct: number;
  settled: number;
  accuracy: number;
  currentStreak: number;
  bestStreak: number;
  latestResult: DemoPredictionResult | null;
  netChange: number;
};

export type DemoLeaderboardEntry = DemoPlayer &
  DemoPlayerStats & {
    rank: number;
    score: number;
    activeStake: number;
  };

export type DemoState = {
  initialBalance: number;
  balance: number;
  markets: DemoMarket[];
  bets: DemoBet[];
  players: DemoPlayer[];
  opponentBets: DemoOpponentBet[];
  transactions: DemoTransaction[];
  nextTransactionId: number;
  settlementOrder: string[];
  rankHistory: number[];
  achievements: DemoEarnedAchievement[];
  newAchievements: DemoAchievementId[];
  message: string | null;
};

export type DemoAction =
  | {
      type: "PLACE_BET";
      marketId: string;
      optionId: string;
      stake: number;
    }
  | {
      type: "EDIT_BET";
      marketId: string;
      stake: number;
    }
  | {
      type: "REMOVE_BET";
      marketId: string;
    }
  | {
      type: "LOCK_MARKET";
      marketId: string;
    }
  | {
      type: "SETTLE_MARKET";
      marketId: string;
    }
  | { type: "CLEAR_MESSAGE" }
  | { type: "DISMISS_ACHIEVEMENTS" }
  | { type: "RESET" };

export const DEMO_INITIAL_BALANCE = 100_000;

const INITIAL_MARKETS: DemoMarket[] = [
  {
    id: "sprint",
    title: "100m Sprint",
    subtitle: "Sports Day · First across the finish line",
    options: [
      {
        id: "red",
        label: "Red Team",
        rewardMultiplier: 2,
        color: "red",
      },
      {
        id: "blue",
        label: "Blue Team",
        rewardMultiplier: 3,
        color: "blue",
      },
      {
        id: "green",
        label: "Green Team",
        rewardMultiplier: 2.5,
        color: "green",
      },
    ],
    status: "open",
    winningOptionId: null,
    simulatedWinnerId: "red",
  },
  {
    id: "beanbag",
    title: "Beanbag Challenge",
    subtitle: "Sports Day · Highest team score",
    options: [
      {
        id: "red",
        label: "Red Team",
        rewardMultiplier: 2.4,
        color: "red",
      },
      {
        id: "blue",
        label: "Blue Team",
        rewardMultiplier: 2.8,
        color: "blue",
      },
      {
        id: "green",
        label: "Green Team",
        rewardMultiplier: 2.2,
        color: "green",
      },
    ],
    status: "open",
    winningOptionId: null,
    simulatedWinnerId: "green",
  },
  {
    id: "tug-of-war",
    title: "Tug of War",
    subtitle: "Sports Day · Winning team",
    options: [
      {
        id: "red",
        label: "Red Team",
        rewardMultiplier: 2.6,
        color: "red",
      },
      {
        id: "blue",
        label: "Blue Team",
        rewardMultiplier: 3.2,
        color: "blue",
      },
      {
        id: "green",
        label: "Green Team",
        rewardMultiplier: 2.1,
        color: "green",
      },
    ],
    status: "open",
    winningOptionId: null,
    simulatedWinnerId: "blue",
  },
];

type OpponentPrediction = {
  playerId: string;
  marketId: string;
  optionId: string;
  stake: number;
};

const OPPONENT_PREDICTIONS: OpponentPrediction[] = [
  {
    playerId: "alex",
    marketId: "sprint",
    optionId: "green",
    stake: 15_000,
  },
  {
    playerId: "alex",
    marketId: "beanbag",
    optionId: "green",
    stake: 10_000,
  },
  {
    playerId: "alex",
    marketId: "tug-of-war",
    optionId: "blue",
    stake: 7_500,
  },
  {
    playerId: "sam",
    marketId: "sprint",
    optionId: "red",
    stake: 20_000,
  },
  {
    playerId: "sam",
    marketId: "beanbag",
    optionId: "red",
    stake: 10_000,
  },
  {
    playerId: "sam",
    marketId: "tug-of-war",
    optionId: "green",
    stake: 10_000,
  },
  {
    playerId: "jordan",
    marketId: "sprint",
    optionId: "blue",
    stake: 10_000,
  },
  {
    playerId: "jordan",
    marketId: "beanbag",
    optionId: "green",
    stake: 20_000,
  },
  {
    playerId: "jordan",
    marketId: "tug-of-war",
    optionId: "red",
    stake: 15_000,
  },
];

export function formatDemoMoney(amount: number): string {
  const value = amount / 100;

  return `${new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)} Orakls`;
}

export function getEventOption(
  market: DemoMarket,
  optionId: string,
): DemoEventOption | undefined {
  return market.options.find((option) => option.id === optionId);
}

export function getOptionLabel(
  market: DemoMarket,
  optionId: string,
): string {
  return getEventOption(market, optionId)?.label ?? "Unknown option";
}

function validateMarketConfiguration(market: DemoMarket): void {
  if (market.options.length < 2) {
    throw new Error(
      `Event "${market.id}" must have at least two options.`,
    );
  }

  const ids = market.options.map((option) => option.id);

  if (new Set(ids).size !== ids.length) {
    throw new Error(
      `Event "${market.id}" has duplicate option IDs.`,
    );
  }

  for (const option of market.options) {
    if (
      !option.id.trim() ||
      !option.label.trim() ||
      !Number.isFinite(option.rewardMultiplier) ||
      option.rewardMultiplier <= 0
    ) {
      throw new Error(
        `Event "${market.id}" contains an invalid option.`,
      );
    }
  }

  if (!getEventOption(market, market.simulatedWinnerId)) {
    throw new Error(
      `Event "${market.id}" has an invalid simulated winner.`,
    );
  }
}

function createOpponentBets(
  markets: DemoMarket[],
): DemoOpponentBet[] {
  return OPPONENT_PREDICTIONS.map((prediction) => {
    const market = markets.find(
      (item) => item.id === prediction.marketId,
    );

    if (!market) {
      throw new Error(
        `Unknown Sports Day event: ${prediction.marketId}`,
      );
    }

    const option = getEventOption(market, prediction.optionId);

    if (!option) {
      throw new Error(
        `Invalid opponent option "${prediction.optionId}" for "${market.id}".`,
      );
    }

    return {
      ...prediction,
      multiplier: option.rewardMultiplier,
      payout: null,
    };
  });
}

export function createInitialDemoState(): DemoState {
  const markets = INITIAL_MARKETS.map((market) => ({
    ...market,
    options: market.options.map((option) => ({ ...option })),
  }));

  markets.forEach(validateMarketConfiguration);

  const opponentBets = createOpponentBets(markets);

  const initialPlayers: DemoPlayer[] = [
    { id: "alex", name: "Alex", balance: 120_000 },
    { id: "sam", name: "Sam", balance: 112_000 },
    { id: "jordan", name: "Jordan", balance: 105_000 },
    {
      id: "visitor",
      name: "You",
      balance: DEMO_INITIAL_BALANCE,
      isVisitor: true,
    },
  ];

  const players = initialPlayers.map((player) => ({
    ...player,
    balance:
      player.balance -
      opponentBets
        .filter((bet) => bet.playerId === player.id)
        .reduce((sum, bet) => sum + bet.stake, 0),
  }));

  const initialState: DemoState = {
    initialBalance: DEMO_INITIAL_BALANCE,
    balance: DEMO_INITIAL_BALANCE,
    markets,
    bets: [],
    players,
    opponentBets,
    transactions: [],
    nextTransactionId: 1,
    settlementOrder: [],
    rankHistory: [],
    achievements: [],
    newAchievements: [],
    message: null,
  };

  const initialRank = getDemoLeaderboard(initialState).find(
    (player) => player.isVisitor,
  )?.rank;

  return {
    ...initialState,
    rankHistory: initialRank === undefined ? [] : [initialRank],
  };
}

function withMessage(
  state: DemoState,
  message: string,
): DemoState {
  return { ...state, message };
}

function isValidStake(stake: number): boolean {
  return Number.isSafeInteger(stake) && stake > 0;
}

function updateVisitorBalance(
  state: DemoState,
  balance: number,
  description: string,
  amount: number,
): Pick<
  DemoState,
  "balance" | "players" | "transactions" | "nextTransactionId"
> {
  return {
    balance,
    players: state.players.map((player) =>
      player.isVisitor ? { ...player, balance } : player,
    ),
    transactions: [
      {
        id: state.nextTransactionId,
        description,
        amount,
        balance,
      },
      ...state.transactions,
    ],
    nextTransactionId: state.nextTransactionId + 1,
  };
}

function getPlayerBets(
  state: DemoState,
  player: DemoPlayer,
): DemoBet[] {
  return player.isVisitor
    ? state.bets
    : state.opponentBets.filter(
        (bet) => bet.playerId === player.id,
      );
}

export function getDemoPlayerStats(
  state: DemoState,
  playerId: string,
): DemoPlayerStats {
  const player = state.players.find(
    (item) => item.id === playerId,
  );

  const emptyStats: DemoPlayerStats = {
    correct: 0,
    settled: 0,
    accuracy: 0,
    currentStreak: 0,
    bestStreak: 0,
    latestResult: null,
    netChange: 0,
  };

  if (!player) return emptyStats;

  const bets = getPlayerBets(state, player);

  let correct = 0;
  let settled = 0;
  let currentStreak = 0;
  let bestStreak = 0;
  let netChange = 0;
  let latestResult: DemoPredictionResult | null = null;

  for (const marketId of state.settlementOrder) {
    const market = state.markets.find(
      (item) => item.id === marketId,
    );

    const bet = bets.find((item) => item.marketId === marketId);

    if (!market || !bet || bet.payout === null) continue;

    const isCorrect = bet.optionId === market.winningOptionId;
    const change = bet.payout - bet.stake;

    settled += 1;
    netChange += change;

    if (isCorrect) {
      correct += 1;
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }

    latestResult = {
      marketId,
      correct: isCorrect,
      netChange: change,
    };
  }

  return {
    correct,
    settled,
    accuracy: settled > 0 ? (correct / settled) * 100 : 0,
    currentStreak,
    bestStreak,
    latestResult,
    netChange,
  };
}

export function getDemoLeaderboard(
  state: DemoState,
): DemoLeaderboardEntry[] {
  return state.players
    .map((player) => {
      const bets = getPlayerBets(state, player);

      const activeStake = bets.reduce((sum, bet) => {
        const market = state.markets.find(
          (item) => item.id === bet.marketId,
        );

        return (
          sum +
          (market && market.status !== "settled" ? bet.stake : 0)
        );
      }, 0);

      return {
        ...player,
        ...getDemoPlayerStats(state, player.id),
        activeStake,
        score: player.balance + activeStake,
        rank: 0,
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.correct - a.correct ||
        a.name.localeCompare(b.name),
    )
    .map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
}

export function getDemoSummary(state: DemoState) {
  const totalStaked = state.bets.reduce(
    (sum, bet) => sum + bet.stake,
    0,
  );

  const totalPayout = state.bets.reduce(
    (sum, bet) => sum + (bet.payout ?? 0),
    0,
  );

  const playerStats = getDemoPlayerStats(state, "visitor");

  return {
    totalStaked,
    totalPayout,
    activeBets: state.bets.filter((bet) =>
      state.markets.some(
        (market) =>
          market.id === bet.marketId &&
          market.status !== "settled",
      ),
    ).length,
    settledMarkets: state.markets.filter(
      (market) => market.status === "settled",
    ).length,
    totalMarkets: state.markets.length,
    netProfit: playerStats.netChange,
    ...playerStats,
  };
}

function awardAchievements(
  previous: DemoState,
  next: DemoState,
  marketId: string,
): DemoState {
  const stats = getDemoPlayerStats(next, "visitor");

  const currentRank = getDemoLeaderboard(next).find(
    (player) => player.isVisitor,
  )?.rank;

  const previousRank = getDemoLeaderboard(previous).find(
    (player) => player.isVisitor,
  )?.rank;

  const rankHistory =
    currentRank === undefined
      ? previous.rankHistory
      : [...previous.rankHistory, currentRank];

  if (currentRank === undefined || previousRank === undefined) {
    return { ...next, rankHistory };
  }

  const { newlyUnlocked } = evaluateAchievements(
    {
      playerId: "visitor",
      correctPredictions: stats.correct,
      settledPredictions: stats.settled,
      currentStreak: stats.currentStreak,
      bestStreak: stats.bestStreak,
      totalEvents: next.markets.length,
      completedEvents: next.markets.filter(
        (market) => market.status === "settled",
      ).length,
      currentRank,
      previousRank,
      competitorCount: next.players.length,
      rankHistory: previous.rankHistory,
    },
    next.achievements.map(
      (achievement) => achievement.achievementId,
    ),
  );

  const sequence = next.settlementOrder.length;

  return {
    ...next,
    rankHistory,
    achievements: [
      ...next.achievements,
      ...newlyUnlocked.map((achievementId) => ({
        achievementId,
        playerId: "visitor",
        unlockedAt: `demo-event-${sequence}`,
        contextId: marketId,
      })),
    ],
    newAchievements: [
      ...next.newAchievements,
      ...newlyUnlocked,
    ],
  };
}

export function demoReducer(
  state: DemoState,
  action: DemoAction,
): DemoState {
  switch (action.type) {
    case "PLACE_BET": {
      const market = state.markets.find(
        (item) => item.id === action.marketId,
      );

      if (!market) {
        return withMessage(state, "Event not found.");
      }

      if (market.status !== "open") {
        return withMessage(
          state,
          "Predictions are closed for this event.",
        );
      }

      if (state.bets.some((bet) => bet.marketId === market.id)) {
        return withMessage(
          state,
          "You already have a prediction for this event.",
        );
      }

      if (!isValidStake(action.stake)) {
        return withMessage(state, "Enter a valid Orakl amount.");
      }

      if (action.stake > state.balance) {
        return withMessage(state, "Insufficient Orakls.");
      }

      const option = getEventOption(market, action.optionId);

      if (!option) {
        return withMessage(
          state,
          "That option is not available for this event.",
        );
      }

      const balance = state.balance - action.stake;

      return {
        ...state,
        ...updateVisitorBalance(
          state,
          balance,
          `Prediction · ${market.title}`,
          -action.stake,
        ),
        bets: [
          ...state.bets,
          {
            marketId: market.id,
            optionId: option.id,
            stake: action.stake,
            multiplier: option.rewardMultiplier,
            payout: null,
          },
        ],
        message: `Prediction recorded: ${option.label}.`,
      };
    }

    case "EDIT_BET": {
      const market = state.markets.find(
        (item) => item.id === action.marketId,
      );

      const bet = state.bets.find(
        (item) => item.marketId === action.marketId,
      );

      if (!market || !bet) {
        return withMessage(state, "Prediction not found.");
      }

      if (market.status !== "open") {
        return withMessage(
          state,
          "Predictions are already closed.",
        );
      }

      if (!isValidStake(action.stake)) {
        return withMessage(state, "Enter a valid Orakl amount.");
      }

      if (action.stake > state.balance + bet.stake) {
        return withMessage(state, "Insufficient Orakls.");
      }

      const difference = action.stake - bet.stake;

      if (difference === 0) {
        return withMessage(
          state,
          "Your committed Orakls are unchanged.",
        );
      }

      const balance = state.balance - difference;

      return {
        ...state,
        ...updateVisitorBalance(
          state,
          balance,
          `Prediction adjustment · ${market.title}`,
          -difference,
        ),
        bets: state.bets.map((item) =>
          item.marketId === market.id
            ? { ...item, stake: action.stake }
            : item,
        ),
        message: "Committed Orakls updated.",
      };
    }

    case "REMOVE_BET": {
      const market = state.markets.find(
        (item) => item.id === action.marketId,
      );

      const bet = state.bets.find(
        (item) => item.marketId === action.marketId,
      );

      if (!market || !bet) {
        return withMessage(state, "Prediction not found.");
      }

      if (market.status !== "open") {
        return withMessage(
          state,
          "Predictions are already closed.",
        );
      }

      const balance = state.balance + bet.stake;

      return {
        ...state,
        ...updateVisitorBalance(
          state,
          balance,
          `Orakls returned · ${market.title}`,
          bet.stake,
        ),
        bets: state.bets.filter(
          (item) => item.marketId !== market.id,
        ),
        message:
          "Prediction removed. Your Orakls have been returned.",
      };
    }

    case "LOCK_MARKET": {
      const market = state.markets.find(
        (item) => item.id === action.marketId,
      );

      if (!market || market.status !== "open") return state;

      return {
        ...state,
        markets: state.markets.map((item) =>
          item.id === market.id
            ? { ...item, status: "locked" }
            : item,
        ),
        message: `Predictions closed for ${market.title}.`,
      };
    }

    case "SETTLE_MARKET": {
      const market = state.markets.find(
        (item) => item.id === action.marketId,
      );

      if (!market || market.status !== "locked") {
        return withMessage(
          state,
          "Close predictions before revealing the result.",
        );
      }

      const winningOption = getEventOption(
        market,
        market.simulatedWinnerId,
      );

      if (!winningOption) {
        return withMessage(
          state,
          "This event has no valid winning option.",
        );
      }

      const visitorBet = state.bets.find(
        (item) => item.marketId === market.id,
      );

      const payout =
        visitorBet?.optionId === winningOption.id
          ? Math.round(
              visitorBet.stake * visitorBet.multiplier,
            )
          : 0;

      const balance = state.balance + payout;

      const opponentBets = state.opponentBets.map((bet) => {
        if (bet.marketId !== market.id) return bet;

        return {
          ...bet,
          payout:
            bet.optionId === winningOption.id
              ? Math.round(bet.stake * bet.multiplier)
              : 0,
        };
      });

      const players = state.players.map((player) => {
        if (player.isVisitor) {
          return { ...player, balance };
        }

        const playerPayout = opponentBets
          .filter(
            (bet) =>
              bet.playerId === player.id &&
              bet.marketId === market.id,
          )
          .reduce((sum, bet) => sum + (bet.payout ?? 0), 0);

        return {
          ...player,
          balance: player.balance + playerPayout,
        };
      });

      const transaction =
        payout > 0
          ? {
              id: state.nextTransactionId,
              description: `Orakls earned · ${market.title}`,
              amount: payout,
              balance,
            }
          : null;

      const next: DemoState = {
        ...state,
        balance,
        players,
        opponentBets,
        markets: state.markets.map((item) =>
          item.id === market.id
            ? {
                ...item,
                status: "settled",
                winningOptionId: winningOption.id,
              }
            : item,
        ),
        bets: state.bets.map((bet) =>
          bet.marketId === market.id
            ? { ...bet, payout }
            : bet,
        ),
        settlementOrder: [
          ...state.settlementOrder,
          market.id,
        ],
        transactions: transaction
          ? [transaction, ...state.transactions]
          : state.transactions,
        nextTransactionId:
          state.nextTransactionId + (transaction ? 1 : 0),
        message: `${market.title} result: ${winningOption.label}.`,
      };

      return awardAchievements(state, next, market.id);
    }

    case "CLEAR_MESSAGE":
      return { ...state, message: null };

    case "DISMISS_ACHIEVEMENTS":
      return { ...state, newAchievements: [] };

    case "RESET":
      return createInitialDemoState();

    default:
      return state;
  }
}
