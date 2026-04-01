import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/apiClient";
import { apiRequest } from "@/lib/api";

export async function fetcher<T>(url: string): Promise<T> {
  return apiGet<T>(url);
}

export async function apiMutationRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<unknown> {
  if (method.toUpperCase() !== "POST") {
    throw new Error(`Unsupported method: ${method}`);
  }

  return apiPost(url, data);
}

type UnauthorizedBehavior = "returnNull" | "throw";

export function getQueryFn<T>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> {
  return async ({ queryKey }) => {
    const url = queryKey.join("/") as string;

    const result = await apiRequest<T>(url, { method: "GET" });

    if (!result.success) {
      if (options.on401 === "returnNull" && result.status === 401) {
        return null as T;
      }

      throw new Error(result.error);
    }

    return result.data;
  };
}

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
