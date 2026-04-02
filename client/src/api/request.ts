import { api } from "@/lib/api";

export function normalize(base: string, path: string) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function apiRequest<T>(
  path: string,
  options?: {
    method?: string;
    body?: unknown;
  }
): Promise<T> {
  return api<T>(path, options);
}
