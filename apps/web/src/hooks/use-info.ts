"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import { Game } from "@/lib/types";

const fetchInfo = (gameId: string) =>
	apiFetch<Game>(`/games/${gameId}`, {
		method: "GET",
	});

export function useInfo(gameId: string) {
  const { data, error, isLoading, mutate } = useSWR(
		["game", gameId],
		([, id]) => fetchInfo(id),
		{
			revalidateOnFocus: false,
		}
	);

  return {
    game: data,
    error,
    isLoading,
    mutate,
  };
}