"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Crown,
  Loader2,
  Minus,
  RefreshCw,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiFetch, isApiError } from "@/lib/api";

type LeaderboardRow = {
  userId: string;
  displayName: string | null;
  score: number;
  rank: number;
  previousRank: number | null;
  rankDelta: number | null;
  details: {
    settledBalance: number;
  };
};

type LeaderboardResponse = {
  scoreLabel: string;
  rows: LeaderboardRow[];
};

type MyState = {
  userId: string;
  currentBalance: number;
};

type FauxStakesLeaderboardProps = {
  competitionId: string;
};

function formatOrakls(value: number) {
  return Math.round(Number(value)).toLocaleString();
}

function leaderboardErrorMessage(error: unknown): string {
  if (!isApiError(error)) {
    return "Unable to load the leaderboard.";
  }

  switch (error.kind) {
    case "authentication":
      return "Your session has expired. Please sign in again.";
    case "permission":
      return "You don't have permission to view this leaderboard.";
    case "not_found":
      return "This competition could not be found.";
    case "network":
      return "We couldn't reach Orakl. Check your connection and try again.";
    case "server":
      return "Orakl couldn't load the leaderboard right now. Please try again.";
    default:
      return error.message || "Unable to load the leaderboard.";
  }
}

function RankMovement({ delta }: { delta: number | null }) {
  if (delta === null) {
    return (
      <span
        className="flex items-center gap-1 text-xs text-white/25"
        title="No previous ranking yet"
      >
        <Minus className="h-3 w-3" />
      </span>
    );
  }

  if (delta > 0) {
    return (
      <span
        className="flex items-center gap-1 text-xs text-emerald-300"
        title={`Up ${delta} place${delta === 1 ? "" : "s"}`}
      >
        <ArrowUp className="h-3 w-3" />
        {delta}
      </span>
    );
  }

  if (delta < 0) {
    return (
      <span
        className="flex items-center gap-1 text-xs text-red-300"
        title={`Down ${Math.abs(delta)} place${
          Math.abs(delta) === 1 ? "" : "s"
        }`}
      >
        <ArrowDown className="h-3 w-3" />
        {Math.abs(delta)}
      </span>
    );
  }

  return (
    <span
      className="flex items-center gap-1 text-xs text-white/25"
      title="No change"
    >
      <Minus className="h-3 w-3" />
    </span>
  );
}

export function FauxStakesLeaderboard({
  competitionId,
}: FauxStakesLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(
    null,
  );
  const [me, setMe] = useState<MyState | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = useCallback(
    async (background = false) => {
      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const [leaderboardData, meData] = await Promise.all([
          apiFetch<LeaderboardResponse>(
            `/competitions/${competitionId}/leaderboard`,
          ),
          apiFetch<MyState>(`/competitions/${competitionId}/me`),
        ]);

        if (!Array.isArray(leaderboardData.rows)) {
          setError("Orakl returned an unexpected leaderboard.");
          return;
        }

        setLeaderboard(leaderboardData);
        setMe(meData);
      } catch (loadError) {
        setError(leaderboardErrorMessage(loadError));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [competitionId],
  );

  useEffect(() => {
    void loadLeaderboard();
  }, [loadLeaderboard]);

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-white/40" />
      </div>
    );
  }

  if (error || !leaderboard || !me) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
        <p className="text-sm text-red-300">
          {error ?? "Unable to load the leaderboard."}
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => void loadLeaderboard()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  const currentPlayer = leaderboard.rows.find(
    (row) => row.userId === me.userId,
  );

  return (
    <div className="space-y-4">
      {currentPlayer ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#F05A28]/20 bg-[#F05A28]/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F05A28]">
              Your balance
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {formatOrakls(me.currentBalance)}
              <span className="ml-2 text-sm font-normal text-white/40">
                Orakls
              </span>
            </p>

            <p className="mt-1 text-xs text-white/40">
              Available to stake right now
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
              Leaderboard balance
            </p>

            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold text-white">
                {formatOrakls(currentPlayer.details.settledBalance)}
                <span className="ml-2 text-sm font-normal text-white/40">
                  Orakls
                </span>
              </p>

              <span className="text-sm font-medium text-white/50">
                #{currentPlayer.rank}
              </span>
            </div>

            <p className="mt-1 text-xs text-white/40">
              Based on resolved markets
            </p>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#F05A28]" />

              <h3 className="font-semibold text-white">Leaderboard</h3>
            </div>

            <p className="mt-1 text-xs text-white/40">
              Rankings use balances from resolved markets only.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={refreshing}
            onClick={() => void loadLeaderboard(true)}
            aria-label="Refresh leaderboard"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {leaderboard.rows.length === 0 ? (
          <div className="p-8 text-center">
            <Trophy className="mx-auto h-6 w-6 text-white/15" />

            <p className="mt-3 text-sm text-white/40">
              No players to rank yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {leaderboard.rows.map((row) => {
              const isCurrentUser = row.userId === me.userId;

              return (
                <div
                  key={row.userId}
                  className={`grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-5 ${
                    isCurrentUser ? "bg-[#F05A28]/[0.07]" : ""
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center">
                    {row.rank === 1 ? (
                      <Crown className="h-5 w-5 text-[#F05A28]" />
                    ) : (
                      <span className="text-sm font-semibold text-white/35">
                        {row.rank}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`truncate text-sm font-medium ${
                          isCurrentUser ? "text-white" : "text-white/75"
                        }`}
                      >
                        {row.displayName || "Player"}
                      </p>

                      {isCurrentUser ? (
                        <span className="rounded-full border border-[#F05A28]/20 bg-[#F05A28]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#F05A28]">
                          You
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <RankMovement delta={row.rankDelta} />

                      {row.previousRank !== null ? (
                        <span className="text-[11px] text-white/25">
                          Previous #{row.previousRank}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums text-white">
                      {formatOrakls(row.score)}
                    </p>

                    <p className="text-[10px] uppercase tracking-wider text-white/30">
                      Orakls
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
