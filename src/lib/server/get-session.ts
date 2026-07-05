import { headers } from "next/headers";

export async function getSession() {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`, {
    headers: { cookie },
  });

  if (!res.ok) return null;
  return res.json();
}