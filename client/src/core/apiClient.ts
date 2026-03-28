import { API_BASE_URL } from "@/config/api";

async function request<T>(method: "GET" | "POST", url: string, body?: unknown): Promise<{ data: T }> {
  const response = await fetch(`${API_BASE_URL}/api${url}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  if (response.status === 204) {
    return { data: undefined as T };
  }

  const data = (await response.json()) as T;
  return { data };
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
