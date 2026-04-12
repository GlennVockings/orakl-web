"use client";

import { getCachedAccessToken } from "./auth-token";

export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch<T>(path: string, init: RequestInit = {}) {
  const jwt = await getCachedAccessToken();

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (jwt) headers.set("Authorization", `Bearer ${jwt}`);

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  return (await res.json()) as T;
}