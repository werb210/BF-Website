import { api } from "@/api/apiClient";

export function normalize(base: string, path: string) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  return api<T>(path, options);
}

export async function bootstrap() {
  await api("/health");
}
