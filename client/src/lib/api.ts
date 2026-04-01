import { apiGet, apiPost } from "@/lib/apiClient";

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; status?: number };

type ApiRequestOptions = Omit<RequestInit, "body" | "method"> & {
  method?: string;
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<ApiResult<T>> {
  const method = (options.method || "GET").toUpperCase();

  try {
    if (method === "GET") {
      const data = await apiGet<T>(path);
      return { success: true, data };
    }

    if (method === "POST") {
      const data = await apiPost<T>(path, options.body);
      return { success: true, data };
    }

    return { success: false, error: `Unsupported method: ${method}` };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}
