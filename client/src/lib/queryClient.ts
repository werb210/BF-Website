import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { safeFetch } from "@/lib/safeFetch";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  extraHeaders?: Record<string, string>,
): Promise<Response> {
  // BF_WEBSITE_BLOCK_v_MAYA_AUDIENCE_HEADER_v1 — optional extraHeaders
  // so callers (notably Maya) can advertise audience without
  // duplicating fetch plumbing. Existing two-arg and three-arg
  // callers are unaffected.
  const baseHeaders: Record<string, string> = data
    ? { "Content-Type": "application/json" }
    : {};
  const headers = extraHeaders
    ? { ...baseHeaders, ...extraHeaders }
    : baseHeaders;
  return await safeFetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;

    if (unauthorizedBehavior === "returnNull") {
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 401) {
        return null;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      return await res.json();
    }

    const res = await safeFetch(url, { credentials: "include" });
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
