"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCallback, useReducer, useState, type ReactNode } from "react";

import { DemoTour } from "@/components/faux-stakes/demo/DemoTour";
import {
  DEMO_ACHIEVEMENTS,
  getDemoAchievement,
} from "@/games/faux-stakes/demo/achievements";
import {
  createInitialDemoState,
  demoReducer,
  formatDemoMoney,
  getDemoLeaderboard,
  getDemoSummary,
  getEventOption,
  getOptionLabel,
  type DemoBet,
  type DemoEventOption,
  type DemoLeaderboardEntry,
  type DemoMarket,
  type DemoState,
} from "@/games/faux-stakes/demo/demo-engine";

type MarketSelection = {
  optionId: string;
  stake: number;
};

type RankMovement = {
  previousRank: number;
  currentRank: number;
  places: number;
};

type RevealMoment = {
  marketId: string;
  title: string;
  winnerLabel: string;
  predictionLabel: string | null;
  correct: boolean | null;
  netChange: number | null;
  sequence: number;
};

type EventIdentity = {
  icon: string;
  category: string;
  description: string;
  accent: string;
  surface: string;
  iconSurface: string;
};

type SidebarPanelId =
  | "leaderboard"
  | "bet-slip"
  | "performance"
  | "achievements"
  | "wallet-activity";

type SidebarOpenState = Record<SidebarPanelId, boolean>;

const DEFAULT_SIDEBAR_STATE: SidebarOpenState = {
  leaderboard: true,
  "bet-slip": true,
  performance: false,
  achievements: false,
  "wallet-activity": false,
};

const EXPANDED_SIDEBAR_STATE: SidebarOpenState = {
  leaderboard: true,
  "bet-slip": true,
  performance: true,
  achievements: true,
  "wallet-activity": true,
};

const EVENT_IDENTITIES: Record<string, EventIdentity> = {
  sprint: {
    icon: "⚡",
    category: "Track event",
    description: "Speed, nerves and a photo-finish moment.",
    accent: "text-amber-300",
    surface: "from-amber-500/15 via-orange-500/5 to-transparent",
    iconSurface: "border-amber-500/30 bg-amber-500/15",
  },
  beanbag: {
    icon: "🎯",
    category: "Precision event",
    description: "Every throw counts towards the team total.",
    accent: "text-sky-300",
    surface: "from-sky-500/15 via-blue-500/5 to-transparent",
    iconSurface: "border-sky-500/30 bg-sky-500/15",
  },
  "tug-of-war": {
    icon: "💪",
    category: "Strength event",
    description: "Teamwork and determination decide the winner.",
    accent: "text-emerald-300",
    surface: "from-emerald-500/15 via-green-500/5 to-transparent",
    iconSurface: "border-emerald-500/30 bg-emerald-500/15",
  },
};

const DEFAULT_EVENT_IDENTITY: EventIdentity = {
  icon: "🏁",
  category: "Sports Day event",
  description: "Make your prediction before the result is revealed.",
  accent: "text-orange-300",
  surface: "from-orange-500/15 via-orange-500/5 to-transparent",
  iconSurface: "border-orange-500/30 bg-orange-500/15",
};

const TEAM_IDENTITIES = {
  red: {
    abbreviation: "RED",
    background: "bg-red-500/15",
    border: "border-red-400",
    softBorder: "border-red-500/30",
    text: "text-red-200",
    dot: "bg-red-400",
  },
  blue: {
    abbreviation: "BLU",
    background: "bg-blue-500/15",
    border: "border-blue-400",
    softBorder: "border-blue-500/30",
    text: "text-blue-200",
    dot: "bg-blue-400",
  },
  green: {
    abbreviation: "GRN",
    background: "bg-emerald-500/15",
    border: "border-emerald-400",
    softBorder: "border-emerald-500/30",
    text: "text-emerald-200",
    dot: "bg-emerald-400",
  },
  neutral: {
    abbreviation: "TEAM",
    background: "bg-orange-500/15",
    border: "border-orange-400",
    softBorder: "border-orange-500/30",
    text: "text-orange-200",
    dot: "bg-orange-400",
  },
} as const;

const STAKE_OPTIONS = [25, 50, 100, 150, 200];

const PANEL =
  "min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/75 p-4 shadow-sm sm:p-5";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507]";

const PRIMARY_BUTTON = `inline-flex min-h-11 items-center justify-center rounded-xl bg-[#F05A28] px-4 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS}`;

const SECONDARY_BUTTON = `inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-800 ${FOCUS}`;

const INPUT_CLASS =
  "min-h-11 w-full min-w-0 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-base text-white outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30";

function eventIdentity(marketId: string): EventIdentity {
  return EVENT_IDENTITIES[marketId] ?? DEFAULT_EVENT_IDENTITY;
}

function teamIdentity(option: DemoEventOption) {
  return TEAM_IDENTITIES[option.color ?? "neutral"];
}

function formatMultiplier(value: number): string {
  return `×${value.toFixed(2)}`;
}

function formatSignedOrakls(amount: number): string {
  return `${amount > 0 ? "+" : ""}${formatDemoMoney(amount)}`;
}

function getStatusLabel(market: DemoMarket): string {
  if (market.status === "open") return "Predictions open";
  if (market.status === "locked") return "Predictions closed";
  return "Result revealed";
}

function getDefaultSelection(
  market: DemoMarket,
  bet?: DemoBet,
): MarketSelection {
  return {
    optionId: bet?.optionId ?? market.options[0]?.id ?? "",
    stake: bet ? bet.stake / 100 : 100,
  };
}

function getRevealMoment(
  state: DemoState,
  marketId: string,
): RevealMoment | null {
  const market = state.markets.find((item) => item.id === marketId);

  if (!market || market.status !== "settled" || !market.winningOptionId) {
    return null;
  }

  const bet = state.bets.find((item) => item.marketId === marketId);

  return {
    marketId,
    title: market.title,
    winnerLabel: getOptionLabel(market, market.winningOptionId),
    predictionLabel: bet ? getOptionLabel(market, bet.optionId) : null,
    correct: bet ? bet.optionId === market.winningOptionId : null,
    netChange: bet ? (bet.payout ?? 0) - bet.stake : null,
    sequence: state.settlementOrder.length,
  };
}

function getPreviousLeaderboard(
  state: DemoState,
): DemoLeaderboardEntry[] | null {
  const latestMarketId = state.settlementOrder.at(-1);

  if (!latestMarketId) return null;

  const market = state.markets.find((item) => item.id === latestMarketId);

  if (!market || market.status !== "settled") return null;

  const visitorPayout =
    state.bets.find((bet) => bet.marketId === latestMarketId)?.payout ?? 0;

  const previousPlayers = state.players.map((player) => {
    if (player.isVisitor) {
      return {
        ...player,
        balance: player.balance - visitorPayout,
      };
    }

    const payout = state.opponentBets
      .filter(
        (bet) => bet.playerId === player.id && bet.marketId === latestMarketId,
      )
      .reduce((sum, bet) => sum + (bet.payout ?? 0), 0);

    return {
      ...player,
      balance: player.balance - payout,
    };
  });

  const previousState: DemoState = {
    ...state,
    balance: state.balance - visitorPayout,
    players: previousPlayers,
    markets: state.markets.map((item) =>
      item.id === latestMarketId
        ? {
            ...item,
            status: "locked",
            winningOptionId: null,
          }
        : item,
    ),
    bets: state.bets.map((bet) =>
      bet.marketId === latestMarketId ? { ...bet, payout: null } : bet,
    ),
    opponentBets: state.opponentBets.map((bet) =>
      bet.marketId === latestMarketId ? { ...bet, payout: null } : bet,
    ),
    settlementOrder: state.settlementOrder.slice(0, -1),
  };

  return getDemoLeaderboard(previousState);
}

function getRankMovements(
  state: DemoState,
  leaderboard: DemoLeaderboardEntry[],
): Record<string, RankMovement> {
  const previous = getPreviousLeaderboard(state);

  if (!previous) return {};

  const previousRanks = new Map(
    previous.map((player) => [player.id, player.rank]),
  );

  return Object.fromEntries(
    leaderboard.map((player) => {
      const previousRank = previousRanks.get(player.id) ?? player.rank;

      return [
        player.id,
        {
          previousRank,
          currentRank: player.rank,
          places: previousRank - player.rank,
        },
      ];
    }),
  );
}

function isLegacyResultMessage(message: string, state: DemoState): boolean {
  return state.markets.some(
    (market) =>
      market.status === "settled" &&
      message.startsWith(`${market.title} result:`),
  );
}

function TeamEmblem({
  option,
  size = "normal",
}: {
  option: DemoEventOption;
  size?: "normal" | "large";
}) {
  const identity = teamIdentity(option);

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-xl border font-black tracking-tight ${identity.background} ${identity.softBorder} ${identity.text} ${
        size === "large" ? "h-12 w-12 text-xs" : "h-9 w-9 text-[10px]"
      }`}
    >
      {identity.abbreviation}
    </span>
  );
}

function TeamLegend({ markets }: { markets: DemoMarket[] }) {
  const teams = markets
    .flatMap((market) => market.options)
    .filter(
      (option, index, options) =>
        options.findIndex((item) => item.label === option.label) === index,
    )
    .filter(
      (option) =>
        option.color === "red" ||
        option.color === "blue" ||
        option.color === "green",
    );

  if (teams.length === 0) return null;

  return (
    <section
      aria-label="Competing teams"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4"
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="w-full text-xs font-bold uppercase tracking-[0.16em] text-zinc-400 sm:w-auto">
          Meet the teams
        </span>

        {teams.map((team) => {
          const identity = teamIdentity(team);

          return (
            <div key={team.label} className="flex items-center gap-2">
              <TeamEmblem option={team} />

              <span className="text-sm font-semibold text-zinc-200">
                {team.label}
              </span>

              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${identity.dot}`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function OverviewCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className={`${PANEL} relative overflow-hidden`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-orange-500/5 blur-2xl"
      />

      <p className="relative text-xs font-medium uppercase tracking-wider text-zinc-400">
        {label}
      </p>

      <p className="relative mt-2 break-words text-xl font-bold tracking-tight text-white sm:text-2xl">
        {value}
      </p>

      {detail && (
        <p className="relative mt-1 text-xs text-zinc-500">{detail}</p>
      )}
    </div>
  );
}

function RankMovementIndicator({ movement }: { movement?: RankMovement }) {
  if (!movement) {
    return <span className="text-xs text-zinc-500">Starting position</span>;
  }

  if (movement.places > 0) {
    return (
      <span
        aria-label={`Up ${movement.places} places from rank ${movement.previousRank}`}
        className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-300"
      >
        ↑ {movement.places} {movement.places === 1 ? "place" : "places"}
      </span>
    );
  }

  if (movement.places < 0) {
    const places = Math.abs(movement.places);

    return (
      <span
        aria-label={`Down ${places} places from rank ${movement.previousRank}`}
        className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[11px] font-bold text-rose-300"
      >
        ↓ {places} {places === 1 ? "place" : "places"}
      </span>
    );
  }

  return (
    <span
      aria-label="Rank unchanged"
      className="inline-flex rounded-full border border-zinc-700 bg-zinc-800/60 px-2 py-1 text-[11px] font-medium text-zinc-400"
    >
      — Unchanged
    </span>
  );
}

function CompletedMarket({
  market,
  bet,
  expanded,
  onToggle,
}: {
  market: DemoMarket;
  bet?: DemoBet;
  expanded: boolean;
  onToggle: () => void;
}) {
  const identity = eventIdentity(market.id);

  const winner = market.winningOptionId
    ? getEventOption(market, market.winningOptionId)
    : undefined;

  const prediction = bet ? getEventOption(market, bet.optionId) : undefined;

  const correct = Boolean(bet) && bet?.optionId === market.winningOptionId;

  const netChange = bet ? (bet.payout ?? 0) - bet.stake : null;

  return (
    <article
      className={`${PANEL} overflow-hidden border-zinc-700/80`}
      aria-labelledby={`completed-title-${market.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl ${identity.iconSurface}`}
          >
            {identity.icon}
          </span>

          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              ✓ Event complete
            </p>

            <h3
              id={`completed-title-${market.id}`}
              className="mt-0.5 text-base font-bold text-white"
            >
              {market.title}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={`completed-details-${market.id}`}
          className={`inline-flex min-h-10 items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800 ${FOCUS}`}
        >
          {expanded ? "Hide details" : "View details"}

          <ChevronDown
            aria-hidden="true"
            size={16}
            strokeWidth={2}
            className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          {winner && <TeamEmblem option={winner} />}

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              Winner
            </p>

            <p className="mt-0.5 text-sm font-bold text-white">
              {winner?.label ?? "—"}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              Your prediction
            </p>

            <p className="mt-0.5 text-sm font-bold text-white">
              {prediction?.label ?? "No prediction"}
            </p>
          </div>

          {bet && (
            <span
              className={`shrink-0 text-xs font-bold ${
                correct ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {correct ? "✓ Correct" : "✕ Incorrect"}
            </span>
          )}
        </div>
      </div>

      <div
        id={`completed-details-${market.id}`}
        hidden={!expanded}
        className="mt-4 border-t border-zinc-800 pt-4"
      >
        <p className="text-xs text-zinc-400">{market.subtitle}</p>

        <p className="mt-1 text-xs text-zinc-500">{identity.description}</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {market.options.map((option) => {
            const isWinner = option.id === market.winningOptionId;
            const wasPredicted = option.id === bet?.optionId;

            return (
              <div
                key={option.id}
                className={`rounded-xl border p-3 ${
                  isWinner
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-zinc-800 bg-zinc-950/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <TeamEmblem option={option} />

                  <span className="text-sm font-semibold text-white">
                    {option.label}
                  </span>
                </div>

                <p className="mt-3 text-xs text-zinc-400">
                  Reward{" "}
                  <strong className="text-white">
                    {formatMultiplier(option.rewardMultiplier)}
                  </strong>
                </p>

                {isWinner && (
                  <p className="mt-2 text-xs font-bold text-emerald-300">
                    ✓ Winner
                  </p>
                )}

                {wasPredicted && (
                  <p className="mt-1 text-xs font-semibold text-orange-300">
                    Your selection
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {bet && (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Your Orakl result
            </h4>

            <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs text-zinc-400">Committed</dt>
                <dd className="mt-1 font-semibold text-white">
                  {formatDemoMoney(bet.stake)}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-zinc-400">Returned</dt>
                <dd className="mt-1 font-semibold text-white">
                  {formatDemoMoney(bet.payout ?? 0)}
                </dd>
              </div>
            </dl>

            {netChange !== null && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-3">
                <span className="text-xs font-medium text-zinc-400">
                  Net change
                </span>

                <strong
                  className={`text-sm ${
                    netChange >= 0 ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {formatSignedOrakls(netChange)}
                </strong>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

type MarketCardProps = {
  market: DemoMarket;
  bet?: DemoBet;
  balance: number;
  selection: MarketSelection;
  onSelectionChange: (selection: MarketSelection) => void;
  onConfirm: () => void;
  onRemove: () => void;
  onLock: () => void;
  onSettle: () => void;
  isFirst: boolean;
};

function MarketCard({
  market,
  bet,
  balance,
  selection,
  onSelectionChange,
  onConfirm,
  onRemove,
  onLock,
  onSettle,
  isFirst,
}: MarketCardProps) {
  const identity = eventIdentity(market.id);
  const isOpen = market.status === "open";

  const selectedOption = getEventOption(market, selection.optionId);

  const stakeMinor = Math.round(selection.stake * 100);
  const available = balance + (bet?.stake ?? 0);

  const validStake =
    Number.isFinite(selection.stake) &&
    Number.isSafeInteger(stakeMinor) &&
    selection.stake > 0 &&
    stakeMinor > 0 &&
    stakeMinor <= available;

  const potentialReward = selectedOption
    ? Math.round(stakeMinor * selectedOption.rewardMultiplier)
    : 0;

  const amountChanged = Boolean(bet && stakeMinor !== bet.stake);
  const amountDifference = bet ? stakeMinor - bet.stake : stakeMinor;

  const amountError =
    !Number.isFinite(selection.stake) ||
    selection.stake <= 0 ||
    !Number.isSafeInteger(stakeMinor) ||
    stakeMinor <= 0
      ? "Enter an amount greater than zero."
      : stakeMinor > available
        ? `You can commit up to ${formatDemoMoney(available)}.`
        : null;

  const stakeInputId = `commit-${market.id}`;
  const stakeHintId = `commit-hint-${market.id}`;
  const stakeErrorId = `commit-error-${market.id}`;

  return (
    <article
      className={`${PANEL} relative overflow-hidden`}
      data-tour={isFirst ? "prediction-controls" : undefined}
      aria-labelledby={`event-title-${market.id}`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b ${identity.surface}`}
      />

      <div className="relative mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            aria-hidden="true"
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-2xl sm:h-14 sm:w-14 ${identity.iconSurface}`}
          >
            {identity.icon}
          </div>

          <div className="min-w-0">
            <p
              className={`mb-1 text-xs font-bold uppercase tracking-[0.16em] ${identity.accent}`}
            >
              {identity.category}
            </p>

            <h3
              id={`event-title-${market.id}`}
              className="text-lg font-bold text-white sm:text-xl"
            >
              {market.title}
            </h3>

            <p className="mt-1 text-sm text-zinc-400">{market.subtitle}</p>

            <p className="mt-2 text-xs text-zinc-500">{identity.description}</p>
          </div>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            isOpen
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-amber-500/40 bg-amber-500/10 text-amber-300"
          }`}
        >
          {getStatusLabel(market)}
        </span>
      </div>

      <fieldset className="relative min-w-0">
        <legend className="mb-3 text-sm font-semibold text-zinc-200">
          Who will win?
        </legend>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-3">
          {market.options.map((option) => {
            const team = teamIdentity(option);
            const selected = selection.optionId === option.id;
            const disabled = !isOpen || Boolean(bet);

            return (
              <label
                key={option.id}
                className={`relative flex min-h-24 min-w-0 flex-col justify-between rounded-xl border p-3 transition-colors ${
                  selected
                    ? `${team.border} ${team.background}`
                    : "border-zinc-700 bg-zinc-950/70"
                } ${
                  disabled
                    ? "cursor-default"
                    : "cursor-pointer hover:border-orange-400/70"
                } focus-within:ring-2 focus-within:ring-orange-400 focus-within:ring-offset-2 focus-within:ring-offset-[#050507]`}
              >
                <input
                  type="radio"
                  name={`prediction-${market.id}`}
                  value={option.id}
                  checked={selected}
                  disabled={disabled}
                  onChange={() =>
                    onSelectionChange({
                      ...selection,
                      optionId: option.id,
                    })
                  }
                  className="sr-only"
                />

                <span className="flex items-center gap-2">
                  <TeamEmblem option={option} />

                  <span className="min-w-0 text-sm font-bold text-white">
                    {option.label}
                  </span>
                </span>

                <span className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                  <span className="text-xs text-zinc-400">Reward</span>

                  <span className="text-sm font-black tabular-nums text-white">
                    {formatMultiplier(option.rewardMultiplier)}
                  </span>
                </span>

                {selected && isOpen && !bet && (
                  <span className="mt-2 text-xs font-semibold text-orange-300">
                    Selected
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      {isOpen && (
        <div className="relative mt-5 space-y-4 border-t border-zinc-800 pt-5">
          <div>
            <label
              htmlFor={stakeInputId}
              className="block text-sm font-semibold text-zinc-200"
            >
              {bet ? "Update committed Orakls" : "Commit virtual Orakls"}
            </label>

            <p
              id={stakeHintId}
              className="mt-1 text-xs leading-relaxed text-zinc-400"
            >
              {bet
                ? `Currently committed: ${formatDemoMoney(bet.stake)}. Changing this amount adjusts your existing prediction.`
                : `Available balance: ${formatDemoMoney(Math.max(0, balance))}.`}
            </p>
          </div>

          <div
            aria-label="Quick Orakl amounts"
            className="grid grid-cols-3 gap-2 sm:grid-cols-5"
          >
            {STAKE_OPTIONS.map((amount) => (
              <button
                key={amount}
                type="button"
                aria-pressed={selection.stake === amount}
                onClick={() =>
                  onSelectionChange({
                    ...selection,
                    stake: amount,
                  })
                }
                className={`min-h-11 rounded-lg border px-2 py-2 text-sm font-semibold transition-colors ${FOCUS} ${
                  selection.stake === amount
                    ? "border-orange-400 bg-orange-500/15 text-orange-300"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {amount}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <div className="min-w-0">
              <div className="relative">
                <input
                  id={stakeInputId}
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="0.01"
                  value={selection.stake}
                  aria-invalid={Boolean(amountError)}
                  aria-describedby={`${stakeHintId} ${
                    amountError ? stakeErrorId : ""
                  }`}
                  onChange={(event) =>
                    onSelectionChange({
                      ...selection,
                      stake: Number(event.target.value),
                    })
                  }
                  className={`${INPUT_CLASS} pr-20`}
                />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-zinc-400"
                >
                  Orakls
                </span>
              </div>

              {amountError && (
                <p id={stakeErrorId} className="mt-2 text-xs text-rose-300">
                  {amountError}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onConfirm}
              disabled={
                !validStake ||
                !selectedOption ||
                (Boolean(bet) && !amountChanged)
              }
              className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
            >
              {bet ? "Save amount" : "Confirm prediction"}
            </button>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 text-sm">
            {bet && (
              <div className="mb-2 flex flex-wrap justify-between gap-2">
                <span className="text-zinc-400">Wallet adjustment</span>

                <strong
                  className={
                    amountDifference > 0
                      ? "text-rose-300"
                      : amountDifference < 0
                        ? "text-emerald-300"
                        : "text-zinc-200"
                  }
                >
                  {validStake
                    ? amountDifference > 0
                      ? `−${formatDemoMoney(amountDifference)}`
                      : amountDifference < 0
                        ? `+${formatDemoMoney(-amountDifference)}`
                        : "No change"
                    : "—"}
                </strong>
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-2">
              <span className="text-zinc-400">Potential reward</span>

              <strong className="text-white">
                {validStake && selectedOption
                  ? formatDemoMoney(potentialReward)
                  : "—"}
              </strong>
            </div>
          </div>

          {bet && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-3">
              <button
                type="button"
                onClick={() =>
                  onSelectionChange({
                    optionId: bet.optionId,
                    stake: bet.stake / 100,
                  })
                }
                className={`${SECONDARY_BUTTON} flex-1 sm:flex-none`}
              >
                Reset amount
              </button>

              <button
                type="button"
                onClick={onRemove}
                className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-rose-500/40 px-4 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/10 sm:flex-none ${FOCUS}`}
              >
                Remove prediction
              </button>
            </div>
          )}
        </div>
      )}

      {bet && (
        <div className="relative mt-5 rounded-xl border border-zinc-700 bg-zinc-950/60 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-zinc-400">Your prediction</p>

              <p className="mt-1 font-bold text-white">
                {getOptionLabel(market, bet.optionId)}
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                {formatDemoMoney(bet.stake)} committed ·{" "}
                {formatMultiplier(bet.multiplier)} reward
              </p>
            </div>

            <span className="text-sm font-bold text-orange-300">Confirmed</span>
          </div>
        </div>
      )}

      <div
        className="relative mt-5 flex flex-col gap-2 border-t border-zinc-800 pt-4 sm:flex-row sm:justify-end"
        data-tour={isFirst ? "market-lifecycle" : undefined}
      >
        {market.status === "open" && (
          <button
            type="button"
            onClick={onLock}
            className={`${SECONDARY_BUTTON} w-full sm:w-auto`}
          >
            Close predictions
          </button>
        )}

        {market.status === "locked" && (
          <button
            type="button"
            onClick={onSettle}
            className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
          >
            Reveal result
          </button>
        )}
      </div>
    </article>
  );
}

function ResultSpotlight({
  moment,
  market,
  movement,
  onDismiss,
}: {
  moment: RevealMoment;
  market: DemoMarket;
  movement?: RankMovement;
  onDismiss: () => void;
}) {
  const identity = eventIdentity(moment.marketId);

  const winningOption = market.winningOptionId
    ? getEventOption(market, market.winningOptionId)
    : undefined;

  const resultLabel =
    moment.correct === null
      ? "No prediction submitted"
      : moment.correct
        ? "Prediction correct"
        : "Prediction incorrect";

  return (
    <section
      aria-label={`Result revealed for ${moment.title}`}
      className="relative overflow-hidden rounded-2xl border border-orange-500/40 bg-gradient-to-br from-orange-950/60 via-zinc-900 to-zinc-950 p-4 shadow-lg shadow-orange-950/20 sm:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/15 blur-3xl"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-2xl ${identity.iconSurface}`}
          >
            {identity.icon}
          </span>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
              Result revealed · Event {moment.sequence}
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-white sm:text-3xl">
              {moment.title}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss result spotlight"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 ${FOCUS}`}
        >
          ✕
        </button>
      </div>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Winning contender
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {winningOption && (
              <TeamEmblem option={winningOption} size="large" />
            )}

            <p className="text-xl font-black text-white sm:text-2xl">
              {moment.winnerLabel}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Your result
          </p>

          <p
            className={`mt-2 text-lg font-extrabold sm:text-xl ${
              moment.correct === true
                ? "text-emerald-300"
                : moment.correct === false
                  ? "text-rose-300"
                  : "text-zinc-200"
            }`}
          >
            {resultLabel}
          </p>

          {moment.predictionLabel && (
            <p className="mt-1 text-sm text-zinc-300">
              You chose {moment.predictionLabel}
            </p>
          )}

          {moment.netChange !== null && (
            <p className="mt-2 text-sm font-semibold text-white">
              {formatSignedOrakls(moment.netChange)} · Net change
            </p>
          )}
        </div>
      </div>

      {movement && (
        <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-700 bg-zinc-950/50 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Leaderboard impact
            </p>

            <p className="mt-1 text-sm text-white">
              Rank #{movement.previousRank} →{" "}
              <strong>#{movement.currentRank}</strong>
            </p>
          </div>

          <RankMovementIndicator movement={movement} />
        </div>
      )}
    </section>
  );
}

function AchievementCelebration({
  state,
  onDismiss,
}: {
  state: DemoState;
  onDismiss: () => void;
}) {
  if (state.newAchievements.length === 0) return null;

  return (
    <section
      aria-label="New achievements"
      className="relative overflow-hidden rounded-2xl border border-amber-400/50 bg-gradient-to-br from-amber-950/50 via-orange-950/40 to-zinc-900 p-4 shadow-lg sm:p-5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-300">
            ★ Achievement unlocked
          </p>

          <p className="mt-1 text-sm text-zinc-300">
            Your Sports Day milestones
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss achievement notifications"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 ${FOCUS}`}
        >
          ✕
        </button>
      </div>

      <div className="relative mt-4 grid gap-3 sm:grid-cols-2">
        {state.newAchievements.map((id) => {
          const achievement = getDemoAchievement(id);

          return (
            <div
              key={id}
              className="flex gap-3 rounded-xl border border-amber-500/30 bg-zinc-950/50 p-4"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/15 text-xl text-amber-300"
              >
                ★
              </span>

              <div className="min-w-0">
                <h3 className="font-bold text-white">{achievement.name}</h3>

                <p className="mt-1 text-sm text-zinc-300">
                  {achievement.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalSummary({
  state,
  onRestart,
}: {
  state: DemoState;
  onRestart: () => void;
}) {
  const leaderboard = getDemoLeaderboard(state);
  const summary = getDemoSummary(state);
  const visitor = leaderboard.find((player) => player.isVisitor);
  const isChampion = visitor?.rank === 1;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-orange-500/40 bg-gradient-to-br from-orange-950/60 via-zinc-900 to-zinc-950 p-5 text-center sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-600 via-amber-300 to-orange-600"
      />

      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
        Community Sports Day · Final results
      </p>

      <div
        aria-hidden="true"
        className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/15 text-3xl text-amber-300"
      >
        {isChampion ? "★" : "✓"}
      </div>

      <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
        {isChampion ? "Sports Day Champion!" : "Sports Day complete!"}
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-300">
        {isChampion
          ? "You finished at the top of the competition. Your predictions earned you first place!"
          : "Every event has finished. Here's how your predictions performed against the competition."}
      </p>

      <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Final rank", `#${visitor?.rank ?? "—"}`],
          ["Correct", `${summary.correct}/${summary.settled}`],
          ["Accuracy", `${summary.accuracy.toFixed(0)}%`],
          ["Achievements", `${state.achievements.length}`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-3"
          >
            <p className="text-xs text-zinc-400">{label}</p>

            <p className="mt-2 text-xl font-extrabold text-white">{value}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm text-zinc-300">
        Final competition score:{" "}
        <strong className="text-white">
          {formatDemoMoney(visitor?.score ?? 0)}
        </strong>
      </p>

      <button
        type="button"
        onClick={onRestart}
        className={`${PRIMARY_BUTTON} mt-6 w-full sm:w-auto`}
      >
        Play Sports Day again
      </button>
    </section>
  );
}

function SidebarAccordion({
  id,
  title,
  subtitle,
  badge,
  open,
  onToggle,
  children,
}: {
  id: SidebarPanelId;
  title: string;
  subtitle?: string;
  badge?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const contentId = `sidebar-content-${id}`;

  return (
    <section
      className={`${PANEL} overflow-hidden`}
      data-tour={id}
      aria-labelledby={`sidebar-heading-${id}`}
    >
      <h2 id={`sidebar-heading-${id}`}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={onToggle}
          className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg text-left ${FOCUS}`}
        >
          <span className="min-w-0">
            <span className="block text-lg font-bold text-white">{title}</span>

            {subtitle && (
              <span className="mt-1 block text-xs font-normal text-zinc-500">
                {subtitle}
              </span>
            )}
          </span>

          <span className="flex shrink-0 items-center gap-3">
            {badge && (
              <span className="rounded-full border border-zinc-700 bg-zinc-800/60 px-2.5 py-1 text-xs font-semibold text-zinc-300">
                {badge}
              </span>
            )}

            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-300"
            >
              <ChevronDown
                size={17}
                strokeWidth={2}
                className={`transition-transform duration-200 motion-reduce:transition-none ${
                  open ? "rotate-180" : ""
                }`}
              />
            </span>
          </span>
        </button>
      </h2>

      <div
        id={contentId}
        hidden={!open}
        className="mt-4 border-t border-zinc-800 pt-4"
      >
        {children}
      </div>
    </section>
  );
}

function DemoSidebar({
  state,
  leaderboard,
  movements,
  openPanels,
  onTogglePanel,
}: {
  state: DemoState;
  leaderboard: DemoLeaderboardEntry[];
  movements: Record<string, RankMovement>;
  openPanels: SidebarOpenState;
  onTogglePanel: (id: SidebarPanelId) => void;
}) {
  const summary = getDemoSummary(state);

  const activePredictions = state.bets.filter((bet) => {
    const market = state.markets.find((item) => item.id === bet.marketId);

    return market?.status !== "settled";
  }).length;

  return (
    <div className="min-w-0 space-y-4">
      <SidebarAccordion
        id="leaderboard"
        title="Leaderboard"
        subtitle="Position changes after the latest result"
        badge={`${leaderboard.length} players`}
        open={openPanels.leaderboard}
        onToggle={() => onTogglePanel("leaderboard")}
      >
        <ol className="space-y-2">
          {leaderboard.map((player) => (
            <li
              key={player.id}
              className={`min-w-0 rounded-xl border p-3 ${
                player.isVisitor
                  ? "border-orange-500/40 bg-orange-500/10"
                  : "border-zinc-800 bg-zinc-950/40"
              }`}
            >
              <div className="flex min-w-0 items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black ${
                        player.rank === 1
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-zinc-800 text-zinc-200"
                      }`}
                    >
                      {player.rank}
                    </span>

                    <p className="font-semibold text-white">{player.name}</p>

                    {player.rank === 1 && (
                      <span
                        aria-label="Competition leader"
                        className="text-sm text-amber-300"
                      >
                        ★
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <RankMovementIndicator movement={movements[player.id]} />
                  </div>
                </div>

                <span className="max-w-[45%] break-words text-right text-sm font-bold tabular-nums text-white">
                  {formatDemoMoney(player.score)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2 text-xs text-zinc-400">
                <span>
                  {player.correct}/{player.settled} correct
                </span>

                {player.latestResult && (
                  <span
                    className={
                      player.latestResult.correct
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }
                  >
                    {player.latestResult.correct ? "✓" : "✕"}{" "}
                    {formatSignedOrakls(player.latestResult.netChange)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </SidebarAccordion>

      <SidebarAccordion
        id="bet-slip"
        title="My predictions"
        badge={`${activePredictions} active`}
        open={openPanels["bet-slip"]}
        onToggle={() => onTogglePanel("bet-slip")}
      >
        {state.bets.length === 0 ? (
          <p className="text-sm text-zinc-400">
            Choose an event winner to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {state.bets.map((bet) => {
              const market = state.markets.find(
                (item) => item.id === bet.marketId,
              );

              if (!market) return null;

              const settled = market.status === "settled";
              const correct =
                settled && bet.optionId === market.winningOptionId;

              const option = getEventOption(market, bet.optionId);

              return (
                <div
                  key={bet.marketId}
                  className="border-b border-zinc-800 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-lg">
                      {eventIdentity(market.id).icon}
                    </span>

                    <p className="text-sm font-semibold text-white">
                      {market.title}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    {option && <TeamEmblem option={option} />}

                    <div>
                      <p className="text-sm text-zinc-200">
                        {getOptionLabel(market, bet.optionId)}
                      </p>

                      <p className="text-xs text-zinc-400">
                        {formatMultiplier(bet.multiplier)} reward
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-zinc-400">
                    Committed: {formatDemoMoney(bet.stake)}
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      settled
                        ? correct
                          ? "text-emerald-300"
                          : "text-rose-300"
                        : "text-zinc-400"
                    }`}
                  >
                    {settled
                      ? `${
                          correct ? "Correct" : "Incorrect"
                        } · Returned ${formatDemoMoney(bet.payout ?? 0)}`
                      : `Potential reward: ${formatDemoMoney(
                          Math.round(bet.stake * bet.multiplier),
                        )}`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </SidebarAccordion>

      <SidebarAccordion
        id="performance"
        title="Your performance"
        badge={`${summary.accuracy.toFixed(0)}% accuracy`}
        open={openPanels.performance}
        onToggle={() => onTogglePanel("performance")}
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Accuracy", `${summary.accuracy.toFixed(0)}%`],
            ["Correct predictions", `${summary.correct}/${summary.settled}`],
            ["Current streak", String(summary.currentStreak)],
            ["Best streak", String(summary.bestStreak)],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-xl bg-zinc-950/60 p-3">
              <p className="text-xs text-zinc-400">{label}</p>

              <p className="mt-1 break-words text-xl font-bold text-white">
                {value}
              </p>
            </div>
          ))}
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          {[
            ["Starting balance", state.initialBalance],
            ["Current balance", state.balance],
            ["Total committed", summary.totalStaked],
            ["Total returned", summary.totalPayout],
          ].map(([label, amount]) => (
            <div
              key={String(label)}
              className="flex flex-wrap justify-between gap-2"
            >
              <dt className="text-zinc-400">{label}</dt>

              <dd className="font-semibold text-zinc-100">
                {formatDemoMoney(Number(amount))}
              </dd>
            </div>
          ))}

          <div className="flex flex-wrap justify-between gap-2 border-t border-zinc-800 pt-3">
            <dt className="font-medium text-zinc-200">Net Orakl change</dt>

            <dd
              className={`font-bold ${
                summary.netProfit >= 0 ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {formatSignedOrakls(summary.netProfit)}
            </dd>
          </div>
        </dl>

        <p className="mt-3 text-xs text-zinc-500">
          Net change includes completed predictions only.
        </p>
      </SidebarAccordion>

      <SidebarAccordion
        id="achievements"
        title="Achievements"
        badge={`${state.achievements.length}/${DEMO_ACHIEVEMENTS.length}`}
        open={openPanels.achievements}
        onToggle={() => onTogglePanel("achievements")}
      >
        <div className="space-y-3">
          {DEMO_ACHIEVEMENTS.map((achievement) => {
            const earned = state.achievements.some(
              (item) => item.achievementId === achievement.id,
            );

            return (
              <div
                key={achievement.id}
                className={`rounded-xl border p-3 ${
                  earned
                    ? "border-orange-500/40 bg-orange-500/10"
                    : "border-zinc-800 bg-zinc-950/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">
                      {achievement.name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                      {achievement.description}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {achievement.criteria}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-xs font-semibold ${
                      earned ? "text-orange-300" : "text-zinc-500"
                    }`}
                  >
                    {earned ? "Unlocked" : "Locked"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </SidebarAccordion>

      <SidebarAccordion
        id="wallet-activity"
        title="Wallet activity"
        badge={`${state.transactions.length} entries`}
        open={openPanels["wallet-activity"]}
        onToggle={() => onTogglePanel("wallet-activity")}
      >
        {state.transactions.length === 0 ? (
          <p className="text-sm text-zinc-400">
            Your Orakl activity will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {state.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-800 pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm text-zinc-200">
                    {transaction.description}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Balance: {formatDemoMoney(transaction.balance)}
                  </p>
                </div>

                <span
                  className={`text-xs font-bold ${
                    transaction.amount >= 0
                      ? "text-emerald-300"
                      : "text-zinc-300"
                  }`}
                >
                  {formatSignedOrakls(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </SidebarAccordion>
    </div>
  );
}

export default function FauxStakesDemoPage() {
  const [state, dispatch] = useReducer(
    demoReducer,
    undefined,
    createInitialDemoState,
  );

  const [tourRunning, setTourRunning] = useState(false);

  const [selections, setSelections] = useState<Record<string, MarketSelection>>(
    {},
  );

  const [dismissedRevealKey, setDismissedRevealKey] = useState<string | null>(
    null,
  );

  const [expandedMarkets, setExpandedMarkets] = useState<
    Record<string, boolean>
  >({});

  const [openPanels, setOpenPanels] = useState<SidebarOpenState>(
    DEFAULT_SIDEBAR_STATE,
  );

  const leaderboard = getDemoLeaderboard(state);
  const summary = getDemoSummary(state);
  const movements = getRankMovements(state, leaderboard);

  const visitor = leaderboard.find((player) => player.isVisitor);

  const allEventsComplete =
    summary.totalMarkets > 0 && summary.settledMarkets === summary.totalMarkets;

  const latestMarketId = state.settlementOrder.at(-1) ?? null;

  const latestMarket = latestMarketId
    ? state.markets.find((market) => market.id === latestMarketId)
    : undefined;

  const revealMoment = latestMarketId
    ? getRevealMoment(state, latestMarketId)
    : null;

  const revealKey = revealMoment
    ? `${revealMoment.sequence}:${revealMoment.marketId}`
    : null;

  const showReveal = revealMoment !== null && revealKey !== dismissedRevealKey;

  const visibleMessage =
    state.message && !isLegacyResultMessage(state.message, state)
      ? state.message
      : null;

  const getSelection = (market: DemoMarket, bet?: DemoBet): MarketSelection =>
    selections[market.id] ?? getDefaultSelection(market, bet);

  const updateSelection = (marketId: string, selection: MarketSelection) => {
    setSelections((previous) => ({
      ...previous,
      [marketId]: selection,
    }));
  };

  const confirmPrediction = (market: DemoMarket, bet?: DemoBet) => {
    const selection = getSelection(market, bet);
    const stake = Math.round(selection.stake * 100);

    if (bet) {
      dispatch({
        type: "EDIT_BET",
        marketId: market.id,
        stake,
      });

      return;
    }

    dispatch({
      type: "PLACE_BET",
      marketId: market.id,
      optionId: selection.optionId,
      stake,
    });
  };

  const toggleMarketDetails = (marketId: string) => {
    setExpandedMarkets((previous) => ({
      ...previous,
      [marketId]: !previous[marketId],
    }));
  };

  const toggleSidebarPanel = (id: SidebarPanelId) => {
    setOpenPanels((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const restart = () => {
    dispatch({ type: "RESET" });
    setSelections({});
    setExpandedMarkets({});
    setDismissedRevealKey(null);
    setOpenPanels(DEFAULT_SIDEBAR_STATE);
  };

  const closeTour = useCallback(() => {
    setTourRunning(false);
  }, []);

  const startTour = () => {
    setOpenPanels(EXPANDED_SIDEBAR_STATE);
    setTourRunning(true);
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#050507] text-zinc-100">
      <DemoTour run={tourRunning} onClose={closeTour} />

      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 sm:mb-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className={`inline-flex min-h-11 items-center text-sm text-zinc-400 transition hover:text-white ${FOCUS}`}
            >
              ← Orakl
            </Link>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={startTour}
                className={`${SECONDARY_BUTTON} text-xs sm:text-sm`}
              >
                ⓘ Tell me more
              </button>

              <button
                type="button"
                onClick={restart}
                className={`${SECONDARY_BUTTON} text-xs sm:text-sm`}
              >
                Restart demo
              </button>
            </div>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400 sm:tracking-[0.25em]">
            Faux Stakes · Interactive demo
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Community Sports Day
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Think you can predict Sports Day? Pick the winning teams, commit
            fictional Orakls, and see how you compare with Alex, Sam and Jordan.
            Every event brings new results, rankings and achievements.
          </p>
        </header>

        <div className="mb-5">
          <TeamLegend markets={state.markets} />
        </div>

        <div
          className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
          data-tour="wallet"
        >
          <OverviewCard
            label="Available Orakls"
            value={formatDemoMoney(state.balance)}
            detail="Your fictional balance"
          />

          <OverviewCard
            label="Competition score"
            value={formatDemoMoney(visitor?.score ?? 0)}
            detail="Includes unfinished commitments"
          />

          <OverviewCard
            label="Your position"
            value={visitor ? `#${visitor.rank}` : "—"}
            detail={`Out of ${leaderboard.length} competitors`}
          />

          <OverviewCard
            label="Correct predictions"
            value={`${summary.correct}/${summary.settled}`}
            detail={`${summary.accuracy.toFixed(0)}% accuracy`}
          />
        </div>

        {visibleMessage && (
          <div
            role="status"
            aria-live="polite"
            className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200"
          >
            <span>{visibleMessage}</span>

            <button
              type="button"
              onClick={() => dispatch({ type: "CLEAR_MESSAGE" })}
              aria-label="Dismiss message"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white ${FOCUS}`}
            >
              ✕
            </button>
          </div>
        )}

        <div className="mb-6 space-y-4">
          {showReveal && revealMoment && revealKey && latestMarket && (
            <ResultSpotlight
              key={revealKey}
              moment={revealMoment}
              market={latestMarket}
              movement={movements.visitor}
              onDismiss={() => setDismissedRevealKey(revealKey)}
            />
          )}

          <AchievementCelebration
            state={state}
            onDismiss={() => dispatch({ type: "DISMISS_ACHIEVEMENTS" })}
          />
        </div>

        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section
            className="min-w-0 space-y-5"
            data-tour="markets"
            aria-labelledby="events-heading"
          >
            <div>
              <h2 id="events-heading" className="text-2xl font-bold text-white">
                Sports Day events
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Make your predictions, close each event and reveal its result.
              </p>
            </div>

            {state.markets.map((market, index) => {
              const bet = state.bets.find(
                (item) => item.marketId === market.id,
              );

              if (market.status === "settled") {
                return (
                  <CompletedMarket
                    key={market.id}
                    market={market}
                    bet={bet}
                    expanded={Boolean(expandedMarkets[market.id])}
                    onToggle={() => toggleMarketDetails(market.id)}
                  />
                );
              }

              return (
                <MarketCard
                  key={market.id}
                  market={market}
                  bet={bet}
                  balance={state.balance}
                  selection={getSelection(market, bet)}
                  onSelectionChange={(selection) =>
                    updateSelection(market.id, selection)
                  }
                  onConfirm={() => confirmPrediction(market, bet)}
                  onRemove={() => {
                    dispatch({
                      type: "REMOVE_BET",
                      marketId: market.id,
                    });

                    setSelections((previous) => {
                      const next = { ...previous };
                      delete next[market.id];
                      return next;
                    });
                  }}
                  onLock={() =>
                    dispatch({
                      type: "LOCK_MARKET",
                      marketId: market.id,
                    })
                  }
                  onSettle={() =>
                    dispatch({
                      type: "SETTLE_MARKET",
                      marketId: market.id,
                    })
                  }
                  isFirst={index === 0}
                />
              );
            })}

            {allEventsComplete && (
              <FinalSummary state={state} onRestart={restart} />
            )}
          </section>

          <aside
            className="min-w-0 lg:sticky lg:top-6"
            aria-label="Competition dashboard"
          >
            <DemoSidebar
              state={state}
              leaderboard={leaderboard}
              movements={movements}
              openPanels={openPanels}
              onTogglePanel={toggleSidebarPanel}
            />
          </aside>
        </div>

        <footer className="mt-12 border-t border-zinc-800 pt-6 text-center text-xs leading-relaxed text-zinc-500">
          Faux Stakes is a fictional, API-free demonstration. Orakls have no
          real-world value. No real money, purchases or external competitions
          are involved.
        </footer>
      </div>
    </main>
  );
}
