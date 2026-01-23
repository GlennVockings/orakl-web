export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getMarkets() {
  const res = await fetch(`${API_URL}/markets`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch markets");
  return res.json();
}

export async function placeBet(payload: { userEmail: string; selectionId: string; stake: number; }) {
  const res = await fetch(`${API_URL}/bets`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (res.ok) {
    const me = await fetch(`${API_URL}/auth/me`, { credentials: 'include' }).then(r=>r.json());
    // me.memberships[i].event => { id, name, status }
    // route to /events/:id, etc.

    return me
  }
}