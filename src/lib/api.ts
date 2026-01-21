import { getToken } from "@/lib/auth";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request<T>(method: "GET" | "POST", path: string, body?: any): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let msg = `API ${res.status} on ${path}`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

export function apiGet<T = any>(path: string): Promise<T> {
  return request<T>("GET", path);
}

export function apiPost<T = any>(path: string, body?: any): Promise<T> {
  return request<T>("POST", path, body);
}
