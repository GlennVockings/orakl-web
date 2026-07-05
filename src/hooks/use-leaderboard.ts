"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import { LeaderboardEntry } from "@/lib/types";

const fetchLeaderbaord = (gameId: string) =>
  apiFetch<LeaderboardEntry[]>(`/games/${gameId}/leaderboard`, {
    method: "GET",
  });

export function useLeaderboard(gameId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    ["leaderboard", gameId],
    ([, id]) => fetchLeaderbaord(id),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    leaderboard: data ?? [],
    error,
    isLoading,
    mutate,
  };
}