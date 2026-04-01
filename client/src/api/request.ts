import { api } from "@/api/apiClient";

export type DegradedApiResponse = {
  degraded: true;
};

export function normalize(base: string, path: string) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function isDegradedApiResponse(value: unknown): value is DegradedApiResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "degraded" in value &&
    (value as { degraded?: unknown }).degraded === true
  );
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T | DegradedApiResponse> {
  return api<T>(path, options);
}

export async function bootstrap() {
  const result = await api("/health");

  if (isDegradedApiResponse(result)) {
    throw new Error("API_NOT_READY");
  }
}
