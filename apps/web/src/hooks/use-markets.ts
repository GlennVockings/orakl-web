"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import { Market } from "@/lib/types";

const fetchMarkets = (gameId: string) =>
  apiFetch<Market[]>(`/games/${gameId}/markets`, {
    method: "GET",
  });

export function useMarkets(gameId: string) {
  const { data, error, isLoading, mutate } = useSWR(
		gameId ? ["markets", gameId] : null, 
		([ , id]) => fetchMarkets(id), 
		{
			revalidateOnFocus: false,
		}
	);

  return {
    markets: data ?? [],
    error,
    isLoading,
    mutate,
  };
}