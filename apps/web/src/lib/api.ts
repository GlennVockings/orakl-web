export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// fetch token from Better Auth (cookie session -> token)
export async function getAccessToken(): Promise<string | null> {
  const res = await fetch(`/api/auth/token`, { // may be /api/auth/token or similar
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) return null;
  const data = await res.json();

  // adapt to actual response shape (often { token } or { accessToken })
  return data.token ?? data.accessToken ?? null;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}) {
  const token = await getAccessToken();
  const headers = new Headers(init.headers);

  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include", // keeps Better Auth cookie available if needed
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}