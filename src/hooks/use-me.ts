"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import { GameMe } from "@/lib/types";

const fetchGameMe = (gameId: string) =>
  apiFetch<GameMe>(`/games/${gameId}/me`, {
    method: "GET",
  });

export function useGameMe(gameId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    gameId ? ["game-me", gameId] : null,
    ([, id]) => fetchGameMe(id),
    { revalidateOnFocus: false },
  );

  return {
    gameMe: data ?? null,
    error,
    isLoading,
    mutate,
  };
}