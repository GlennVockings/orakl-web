"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Lock,
  Plus,
  Radio,
  Trophy,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Team = { id: string; name: string };
type MarketStatus = "DRAFT" | "OPEN" | "CLOSED" | "SETTLED";

type Selection = {
  id: string;
  label: string | null;
  decimalOdds: string | number;
  status?: string;
  team: Team | null;
};

type Market = {
  id: string;
  name: string;
  status: MarketStatus;
  selections: Selection[];
};

type MyState = {
  currentBalance?: number;
};

type Bet = {
  id: string;
  stake: number;
  potentialReturn: number;
  oddsSnapshot: number;
  status: "PENDING" | "WON" | "LOST" | "VOID";
  market: {
    id: string;
    name: string;
    status: MarketStatus;
  };
  selection: {
    id: string;
    label: string | null;
    team: Team | null;
    status: string;
  };
};

type Props = {
  competitionId: string;
  isHost: boolean;
};

type Mode = "teams" | "custom";

const selectionName = (selection: {
  label: string | null;
  team: Team | null;
}) => selection.team?.name ?? selection.label ?? "Unnamed selection";

const statusLabel = (status: MarketStatus) =>
  status === "SETTLED" ? "Resolved" : status[0] + status.slice(1).toLowerCase();

export function MarketSetup({ competitionId, isHost }: Props) {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>("teams");
  const [marketName, setMarketName] = useState("");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [customOutcomes, setCustomOutcomes] = useState(["Yes", "No"]);

  const [resolvingMarketId, setResolvingMarketId] = useState<string | null>(
    null,
  );
  const [winningSelectionId, setWinningSelectionId] = useState("");

  const [stakes, setStakes] = useState<Record<string, string>>({});

  /*
   * React state is intentionally not our synchronous interaction lock.
   *
   * setBusyId() schedules a render, which means two very fast events can
   * theoretically both observe the old state before React has updated it.
   *
   * A ref changes immediately and therefore closes that small window.
   *
   * busyId still exists because state is the right tool for rendering
   * disabled buttons and loading indicators.
   */
  const operationLockRef = useRef(false);

  const beginOperation = useCallback((id: string) => {
    if (operationLockRef.current) {
      return false;
    }

    operationLockRef.current = true;
    setBusyId(id);

    return true;
  }, []);

  const endOperation = useCallback(() => {
    operationLockRef.current = false;
    setBusyId(null);
  }, []);

  const loadData = useCallback(async () => {
    const [marketData, teamData, betData, me] = await Promise.all([
      apiFetch<Market[]>(`/competitions/${competitionId}/faux-stakes/markets`),
      apiFetch<Team[]>(`/competitions/${competitionId}/faux-stakes/teams`),
      apiFetch<Bet[]>(`/competitions/${competitionId}/faux-stakes/bets`),
      apiFetch<MyState>(`/competitions/${competitionId}/me`),
    ]);

    if (!marketData || !teamData || !betData || !me) {
      setError("Unable to load Faux Stakes.");
      setLoading(false);
      return;
    }

    setMarkets(marketData);
    setTeams(teamData);
    setBets(betData);
    setBalance(Number(me.currentBalance ?? 0));
    setLoading(false);
  }, [competitionId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const validCustom = useMemo(
    () => customOutcomes.map((outcome) => outcome.trim()).filter(Boolean),
    [customOutcomes],
  );

  const canCreate =
    marketName.trim().length > 0 &&
    (mode === "teams"
      ? selectedTeamIds.length >= 2
      : validCustom.length >= 2 &&
        new Set(validCustom.map((outcome) => outcome.toLowerCase())).size ===
          validCustom.length);

  async function createMarket() {
    if (!canCreate || !beginOperation("create")) {
      return;
    }

    setError(null);

    try {
      const body =
        mode === "teams"
          ? {
              name: marketName.trim(),
              teamSelections: selectedTeamIds.map((teamId) => ({
                teamId,
              })),
            }
          : {
              name: marketName.trim(),
              labelSelections: validCustom.map((label) => ({
                label,
              })),
            };

      const result = await apiFetch(
        `/competitions/${competitionId}/faux-stakes/markets`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );

      if (!result) {
        setError("Unable to create market.");
        return;
      }

      setMarketName("");
      setSelectedTeamIds([]);
      setCustomOutcomes(["Yes", "No"]);

      await loadData();
    } finally {
      endOperation();
    }
  }

  async function transition(marketId: string, action: "open" | "close") {
    if (!beginOperation(marketId)) {
      return;
    }

    setError(null);

    try {
      const result = await apiFetch(
        `/competitions/${competitionId}/faux-stakes/markets/${marketId}/${action}`,
        {
          method: "POST",
        },
      );

      if (!result) {
        setError(`Unable to ${action} market.`);
        return;
      }

      await loadData();
    } finally {
      endOperation();
    }
  }

  async function resolve(marketId: string) {
    if (!winningSelectionId || !beginOperation(marketId)) {
      return;
    }

    setError(null);

    try {
      const result = await apiFetch(
        `/competitions/${competitionId}/faux-stakes/markets/${marketId}/settle`,
        {
          method: "POST",
          body: JSON.stringify({
            winningSelectionId,
          }),
        },
      );

      if (!result) {
        setError("Unable to resolve market.");
        return;
      }

      setResolvingMarketId(null);
      setWinningSelectionId("");

      await loadData();
    } finally {
      endOperation();
    }
  }

  async function placeStake(marketId: string, selectionId: string) {
    /*
     * Validate before acquiring the operation lock.
     *
     * A validation failure never starts an asynchronous operation, so
     * there is no reason to lock the UI.
     */
    const amount = Number(stakes[selectionId]);

    if (!Number.isFinite(amount) || amount < 1) {
      setError("Stake must be at least 1 Orakl.");
      return;
    }

    if (amount > balance) {
      setError("You do not have enough Orakls for that stake.");
      return;
    }

    /*
     * This is the important double-click guard.
     *
     * The ref changes synchronously, so a second event fired before
     * React rerenders cannot create another UUID-backed request.
     */
    if (!beginOperation(selectionId)) {
      return;
    }

    setError(null);

    /*
     * Generate exactly one key for this intended submission.
     *
     * The key lives for the duration of this request. If the same
     * request were submitted twice, the API/database idempotency
     * protection ensures only one Bet/DEBIT is created.
     *
     * A later deliberate stake gets a new UUID, which is correct because
     * multiple independent stakes are a supported Faux Stakes feature.
     */
    const idempotencyKey = crypto.randomUUID();

    try {
      const result = await apiFetch<{
        currentBalance: number;
      }>(`/competitions/${competitionId}/faux-stakes/bets`, {
        method: "POST",
        body: JSON.stringify({
          marketId,
          selectionId,
          stake: amount,
          idempotencyKey,
        }),
      });

      if (!result) {
        setError(
          "Stake was not accepted. The market may have closed or your balance may have changed.",
        );
        return;
      }

      /*
       * Apply the authoritative balance returned by the API immediately.
       *
       * loadData() below then refreshes all related state, including the
       * player's own stake history.
       */
      setBalance(result.currentBalance);

      setStakes((current) => ({
        ...current,
        [selectionId]: "",
      }));

      await loadData();
    } finally {
      endOperation();
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <span className="text-sm text-white/50">Your balance</span>

        <strong className="text-lg text-white">
          {balance.toLocaleString()} Orakls
        </strong>
      </div>

      {isHost && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F05A28]">
              Create market
            </p>

            <p className="mt-1 text-sm text-white/50">
              New markets remain drafts until you open them.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={mode === "teams" ? "default" : "outline"}
              disabled={!!busyId}
              onClick={() => setMode("teams")}
            >
              Teams
            </Button>

            <Button
              variant={mode === "custom" ? "default" : "outline"}
              disabled={!!busyId}
              onClick={() => setMode("custom")}
            >
              Custom outcomes
            </Button>
          </div>

          <input
            value={marketName}
            onChange={(event) => setMarketName(event.target.value)}
            placeholder="Who will win?"
            maxLength={100}
            disabled={!!busyId}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />

          {mode === "teams" ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  type="button"
                  disabled={!!busyId}
                  onClick={() =>
                    setSelectedTeamIds((ids) =>
                      ids.includes(team.id)
                        ? ids.filter((id) => id !== team.id)
                        : [...ids, team.id],
                    )
                  }
                  className={`rounded-xl border px-4 py-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50 ${
                    selectedTeamIds.includes(team.id)
                      ? "border-[#F05A28]/50 bg-[#F05A28]/10 text-white"
                      : "border-white/10 text-white/60"
                  }`}
                >
                  {team.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {customOutcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={outcome}
                    disabled={!!busyId}
                    onChange={(event) =>
                      setCustomOutcomes((items) =>
                        items.map((item, itemIndex) =>
                          itemIndex === index ? event.target.value : item,
                        ),
                      )
                    }
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  {customOutcomes.length > 2 && (
                    <button
                      type="button"
                      disabled={!!busyId}
                      onClick={() =>
                        setCustomOutcomes((items) =>
                          items.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                      className="disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Remove outcome ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                disabled={!!busyId}
                onClick={() => setCustomOutcomes((items) => [...items, ""])}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add outcome
              </Button>
            </div>
          )}

          <Button
            disabled={!canCreate || !!busyId}
            onClick={() => void createMarket()}
          >
            {busyId === "create" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Create draft market
          </Button>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {markets.map((market) => {
          const myBets = bets.filter(
            (bet) => bet.market.id === market.id && bet.status !== "VOID",
          );

          return (
            <div
              key={market.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">{market.name}</h3>

                  <p className="mt-1 text-xs uppercase tracking-wider text-white/40">
                    {statusLabel(market.status)}
                  </p>
                </div>

                {isHost && (
                  <div className="flex gap-2">
                    {market.status === "DRAFT" && (
                      <Button
                        size="sm"
                        disabled={!!busyId}
                        onClick={() => void transition(market.id, "open")}
                      >
                        {busyId === market.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Radio className="mr-2 h-4 w-4" />
                        )}
                        Open
                      </Button>
                    )}

                    {market.status === "OPEN" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!!busyId}
                        onClick={() => void transition(market.id, "close")}
                      >
                        {busyId === market.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Lock className="mr-2 h-4 w-4" />
                        )}
                        Close
                      </Button>
                    )}

                    {market.status === "CLOSED" && (
                      <Button
                        size="sm"
                        disabled={!!busyId}
                        onClick={() => {
                          setResolvingMarketId(market.id);
                          setWinningSelectionId("");
                        }}
                      >
                        <Trophy className="mr-2 h-4 w-4" />
                        Resolve
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {market.selections.map((selection) => (
                  <div
                    key={selection.id}
                    className={`rounded-xl border p-4 ${
                      selection.status === "WINNER"
                        ? "border-[#F05A28]/40 bg-[#F05A28]/10"
                        : "border-white/10 bg-black/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-white">
                        {selectionName(selection)}
                      </span>

                      <span className="text-sm text-white/50">
                        {Number(selection.decimalOdds).toFixed(2)}
                      </span>
                    </div>

                    {market.status === "OPEN" && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={stakes[selection.id] ?? ""}
                          disabled={!!busyId}
                          onChange={(event) =>
                            setStakes((current) => ({
                              ...current,
                              [selection.id]: event.target.value,
                            }))
                          }
                          placeholder="Orakls"
                          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        />

                        <Button
                          size="sm"
                          disabled={!!busyId}
                          onClick={() =>
                            void placeStake(market.id, selection.id)
                          }
                        >
                          {busyId === selection.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Stake"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {resolvingMarketId === market.id && (
                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-sm font-medium text-white">
                    Select the winning outcome
                  </p>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {market.selections.map((selection) => (
                      <button
                        key={selection.id}
                        type="button"
                        disabled={!!busyId}
                        onClick={() => setWinningSelectionId(selection.id)}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${
                          winningSelectionId === selection.id
                            ? "border-[#F05A28]/50 bg-[#F05A28]/10 text-white"
                            : "border-white/10 text-white/60"
                        }`}
                      >
                        <span>{selectionName(selection)}</span>

                        {winningSelectionId === selection.id && (
                          <CheckCircle2 className="h-4 w-4 text-[#F05A28]" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      disabled={!winningSelectionId || !!busyId}
                      onClick={() => void resolve(market.id)}
                    >
                      {busyId === market.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trophy className="mr-2 h-4 w-4" />
                      )}
                      Confirm result
                    </Button>

                    <Button
                      variant="outline"
                      disabled={!!busyId}
                      onClick={() => {
                        setResolvingMarketId(null);
                        setWinningSelectionId("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {myBets.length > 0 && (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    Your stakes
                  </p>

                  <div className="mt-2 space-y-2">
                    {myBets.map((bet) => (
                      <div
                        key={bet.id}
                        className="flex flex-wrap items-center justify-between gap-2 text-sm"
                      >
                        <span className="text-white/70">
                          {selectionName(bet.selection)} · {bet.stake} Orakls @{" "}
                          {bet.oddsSnapshot.toFixed(2)}
                        </span>

                        <span className="text-white/40">
                          {bet.status === "PENDING"
                            ? `Potential ${bet.potentialReturn.toFixed(2)}`
                            : bet.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
