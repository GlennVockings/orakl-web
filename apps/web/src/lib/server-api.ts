import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!; // e.g. http://localhost:3000

const getJwtFromBetterAuth = cache( async(): Promise<string | null> => {
  const cookieHeader = (await cookies())
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join("; ");

  // This hits your Next route handler that Better Auth exposes
  const res = await fetch(`${APP_URL}/api/auth/token`, {
    method: "POST",
    headers: { cookie: cookieHeader }, // forward session cookie
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { token?: string };
  return data.token ?? null;
})

export async function apiServerFetch<T>(path: string, init: RequestInit = {}) {
  console.log("[apiServerFetch] calling:", `${API_URL}${path}`);
  const jwt = await getJwtFromBetterAuth();
  if (!jwt) return null; // not logged in

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${jwt}`);

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!res.ok) return null;
  return (await res.json()) as T;
}