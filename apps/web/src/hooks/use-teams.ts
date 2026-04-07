"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import { Team } from "@/lib/types";

const fetchTeams = (gameId: string) =>
  apiFetch<Team[]>(`/games/${gameId}/teams`, {
    method: "GET",
  });

export function useTeams(gameId: string) {
  const { data, error, isLoading, mutate } = useSWR(
		gameId ? ["teams", gameId] : null, 
		([ , id]) => fetchTeams(id),
		{
			revalidateOnFocus: false,
		}
	);

  return {
    teams: data ?? [],
    error,
    isLoading,
    mutate,
  };
}