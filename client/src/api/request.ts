import { getApiBaseUrl } from "@/config/envGuard";

export function normalize(base: string, path: string) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
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

    const status = (json as { status?: unknown }).status;

    if (status === "error") {
      const message = (json as { error?: { message?: unknown } }).error?.message;
      throw new Error(typeof message === "string" ? message : "API_ERROR");
    }

    if (status !== "ok") {
      throw new Error("UNKNOWN_STATUS");
    }

    return (json as { data: T }).data;
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
