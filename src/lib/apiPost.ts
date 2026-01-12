import { API_BASE_URL } from "@/lib/api";
import { getToken } from "@/lib/auth";

export async function apiPost<TResponse = any, TBody = any>(
  path: string,
  body?: TBody
): Promise<TResponse> {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return res.json() as Promise<TResponse>;
}
