import { getApiBaseUrl } from "@/config/envGuard";

export type ApiEnvelope<T> =
  | { status: "ok"; data: T }
  | { status: "error"; error: string };

const API_BASE = getApiBaseUrl();

export async function api<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, opts);
  const json = (await res.json()) as ApiEnvelope<T>;

  if (json.status === "error") {
    throw new Error(json.error);
  }

  return json.data;
}
