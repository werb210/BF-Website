// BF_WEBSITE_BLOCK_v_MAYA_AUDIENCE_HEADER_v1 — pass-through for
// optional headers so callers can advertise audience or other
// per-call metadata without bypassing the shared apiRequest
// helper. The public surface of api.get/api.post is backward
// compatible: previous (url) / (url, body) call sites continue
// to work unchanged.
import { apiRequest } from "@/lib/queryClient";

async function request<T>(
  method: "GET" | "POST",
  url: string,
  body?: unknown,
  headers?: Record<string, string>,
): Promise<{ data: T }> {
  const response = await apiRequest(method, `/api${url}`, body, headers);
  const data = (await response.json()) as T;
  return { data };
}

const api = {
  get<T>(url: string, headers?: Record<string, string>) {
    return request<T>("GET", url, undefined, headers);
  },
  post<T>(url: string, body?: unknown, headers?: Record<string, string>) {
    return request<T>("POST", url, body, headers);
  },
};

export default api;
