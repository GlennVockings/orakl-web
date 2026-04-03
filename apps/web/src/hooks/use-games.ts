"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import { GameSummary } from "@/lib/types";



const fetchGames = () =>
  apiFetch<GameSummary[]>("/games", {
    method: "GET",
  });

export function useGames() {
  const { data, error, isLoading, mutate } = useSWR("games", fetchGames, {
    revalidateOnFocus: false,
  });

  return {
    games: data ?? [],
    error,
    isLoading,
    mutate,
  };
}