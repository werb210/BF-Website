import { getApiBaseUrl } from "@/config/envGuard";

export type DegradedApiResponse = {
  degraded: true;
  error: string;
};

type ApiEnvelope<T> =
  | { status: "ok"; data: T }
  | { status: "error"; error?: string | { message?: string } };

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

function extractErrorMessage(error: ApiEnvelope<unknown>["error"]) {
  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null && typeof error.message === "string") {
    return error.message;
  }

  return "API_ERROR";
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T | DegradedApiResponse> {
  const base = getApiBaseUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(normalize(base, path), {
      ...options,
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP_ERROR_${res.status}`);
    }

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      throw new Error("INVALID_JSON_RESPONSE");
    }

    if (!json || typeof json !== "object" || !("status" in json)) {
      throw new Error("INVALID_API_SHAPE");
    }

    const payload = json as ApiEnvelope<T>;
    const status = payload.status;

    if (status === "error") {
      const message = extractErrorMessage(payload.error);
      if (message === "DB_NOT_READY") {
        return { degraded: true, error: message };
      }
      throw new Error(message);
    }

    if (status !== "ok") {
      throw new Error("UNKNOWN_STATUS");
    }

    return payload.data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function bootstrap() {
  const base = getApiBaseUrl();
  const res = await fetch(normalize(base, "/health"));

  if (!res.ok) {
    throw new Error("API_HEALTH_CHECK_FAILED");
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new Error("INVALID_JSON_RESPONSE");
  }

  if (!json || typeof json !== "object" || (json as { status?: unknown }).status !== "ok") {
    throw new Error("API_NOT_READY");
  }
}
