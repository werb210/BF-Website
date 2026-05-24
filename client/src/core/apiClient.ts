// BF_WEBSITE_BLOCK_v_MAYA_AUDIENCE_HEADER_v1 — pass-through for
// optional headers so callers can advertise audience or other
// per-call metadata without bypassing the shared apiRequest
// helper. The public surface of api.get/api.post is backward
// compatible: previous (url) / (url, body) call sites continue
// to work unchanged.
// BFW_BLOCK_v152_TALK_HUMAN_COPY_AND_ISSUE_ROUTE_v1 — the website is
// hosted on a different Azure origin than BF-Server (boreal.financial
// vs. server.boreal.financial). safeFetch does a raw fetch with no
// host prepended, so api.post("/maya/escalate") was 404ing on the
// static-web-app origin. Prepend WEBSITE_API_BASE here so every Maya
// call hits the actual BF-Server.
import { apiRequest } from "@/lib/queryClient";
import { WEBSITE_API_BASE } from "@/config/api";

async function request<T>(
  method: "GET" | "POST",
  url: string,
  body?: unknown,
  headers?: Record<string, string>,
): Promise<{ data: T }> {
  const response = await apiRequest(method, `${WEBSITE_API_BASE}/api${url}`, body, headers);
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
