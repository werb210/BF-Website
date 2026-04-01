import { getApiBaseUrl } from "@/config/envGuard";
export type ApiClientResponse<T> = T | { degraded: true };

function normalize(base: string, path: string) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}


type ApiEnvelope<T> =
  | { status: "ok"; data: T }
  | { status: "error"; error?: string | { message?: string } };

function extractErrorMessage(error: ApiEnvelope<unknown>["error"]) {
  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null && typeof error.message === "string") {
    return error.message;
  }

  return "API_ERROR";
}

export async function api<T>(path: string, opts: RequestInit = {}): Promise<ApiClientResponse<T>> {
  const base = getApiBaseUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await globalThis.fetch(normalize(base, path), {
      ...opts,
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

    if (payload.status === "error") {
      const message = extractErrorMessage(payload.error);
      if (message === "DB_NOT_READY") {
        return { degraded: true };
      }
      throw new Error(message);
    }

    if (payload.status !== "ok") {
      throw new Error("UNKNOWN_STATUS");
    }

    return payload.data;
  } finally {
    clearTimeout(timeout);
  }
}
