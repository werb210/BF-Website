import { API_BASE_URL } from "@/config/api";

type ApiSuccess<T> = { success: true; data: T };
type ApiFailure = { success: false; message: string; status?: number };

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

function buildUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const isFormData = options.body instanceof FormData;
    const headers = new Headers(options.headers || {});

    if (!isFormData) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
      }
    }

    const body =
      options.body && !isFormData && typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : options.body;

    const response = await window.fetch(buildUrl(path), {
      ...options,
      headers,
      body,
      credentials: options.credentials ?? "include",
    });

    const responseText = await response.text();
    const parsed = responseText ? JSON.parse(responseText) : null;

    if (!response.ok) {
      const message =
        parsed?.message ||
        parsed?.error ||
        `Request failed with status ${response.status}`;

      return { success: false, message, status: response.status };
    }

    return { success: true, data: parsed as T };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Request failed",
    };
  }
}
