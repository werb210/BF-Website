import { apiRequest } from "@/lib/api";

async function request<T>(method: "GET" | "POST", url: string, body?: unknown): Promise<{ data: T }> {
  const response = await apiRequest<T>(`/api${url}`, {
    method,
    body,
  });

  if (!response.success) {
    throw new Error(response.message);
  }

  return { data: response.data };
}

const api = {
  get<T>(url: string) {
    return request<T>("GET", url);
  },
  post<T>(url: string, body?: unknown) {
    return request<T>("POST", url, body);
  },
};

export default api;
