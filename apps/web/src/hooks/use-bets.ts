"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import { BetList } from "@/lib/types";

const fetchBets = (gameId: string) =>
  apiFetch<BetList[]>(`/games/${gameId}/bets`, {
    method: "GET",
  });

export function useBets(gameId: string) {
  const { data, error, isLoading, mutate } = useSWR(["bets", gameId], ([ ,id]) => fetchBets(id), {
    revalidateOnFocus: false,
  });

  return {
    bets: data ?? [],
    error,
    isLoading,
    mutate,
  };
}