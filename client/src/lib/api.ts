import { API_BASE_URL } from "@/config/api";
import { ApiClientError, apiRequest as apiClientRequest, type ApiResponse } from "@/lib/apiClient";

type ApiSuccess<T> = { success: true; data: T };
type ApiFailure = { success: false; message: string; status?: number };

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

const DEFAULT_TIMEOUT_MS = 10_000;

function buildUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<ApiResult<T>> {
  const timeoutMs = typeof options.keepalive === "boolean" && options.keepalive ? 0 : DEFAULT_TIMEOUT_MS;
  const timeoutController = new AbortController();
  const userSignal = options.signal;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let didTimeout = false;

  const handleUserAbort = () => {
    timeoutController.abort();
  };

  if (userSignal) {
    if (userSignal.aborted) {
      return { success: false, message: "aborted" };
    }
    userSignal.addEventListener("abort", handleUserAbort, { once: true });
  }

  if (timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      didTimeout = true;
      timeoutController.abort();
    }, timeoutMs);
  }

  try {
    const response = await apiClientRequest<ApiResponse<T>>(buildUrl(path), {
      ...options,
      signal: timeoutController.signal,
      credentials: options.credentials ?? "include",
    });

    const isFailure = response?.success === false;

    if (isFailure) {
      return {
        success: false,
        message: response.message || response.error || "Request failed",
      };
    }

    return { success: true, data: (response?.data ?? response) as T };
  } catch (error) {
    if (error instanceof ApiClientError) {
      const payload = error.payload as ApiResponse<T> | undefined;
      return {
        success: false,
        message: payload?.message || payload?.error || error.message,
        status: error.status,
      };
    }
    if (didTimeout) {
      return { success: false, message: "timeout" };
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, message: "aborted" };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Request failed",
    };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (userSignal) {
      userSignal.removeEventListener("abort", handleUserAbort);
    }
  }
}
