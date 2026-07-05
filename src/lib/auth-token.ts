"use client";

import { authClient } from "./auth-client";

type CachedToken = { token: string; expMs: number } | null;

let cached: CachedToken = null;
let inFlight: Promise<string | null> | null = null;

function decodeJwtExpMs(jwt: string): number | null {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1] ?? ""));
    if (!payload?.exp) return null;
    return payload.exp * 1000; // exp is seconds
  } catch {
    return null;
  }
}

// Refresh 60s before expiry
const SKEW_MS = 60_000;

export async function getCachedAccessToken(): Promise<string | null> {
  const now = Date.now();

  if (cached && cached.expMs - SKEW_MS > now) {
    return cached.token;
  }

  if (inFlight) return inFlight;

  inFlight = (async () => {
    const { data, error } = await authClient.token(); // uses session cookie
    if (error || !data?.token) {
      cached = null;
      return null;
    }

    const expMs = decodeJwtExpMs(data.token) ?? now + 55 * 60_000; // fallback
    cached = { token: data.token, expMs };
    return data.token;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}