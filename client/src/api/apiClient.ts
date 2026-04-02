import { apiRequest } from "@/lib/api";

export async function api<T>(url: string, opts?: {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}): Promise<T> {
  return apiRequest<T>(url, opts);
}
