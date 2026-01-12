import { getToken } from "@/lib/auth";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function apiGet<T = any>(path: string): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}
