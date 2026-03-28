import { API_BASE_URL } from "../config/api";

type RequestConfig = {
  headers?: Record<string, string>;
};

async function post<T>(path: string, payload: unknown, config?: RequestConfig): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(config?.headers ?? {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  post,
};
