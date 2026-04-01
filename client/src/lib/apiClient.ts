export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const BASE_URL = import.meta.env.VITE_API_URL || "";

function buildUrl(path: string) {
  if (!path.startsWith("/api/")) {
    throw new Error(`Invalid API path: ${path}`);
  }
  return `${BASE_URL}${path}`;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json: ApiResponse<T> = await res.json();

  if (!json.success) throw new Error(json.error);
  return json.data;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json: ApiResponse<T> = await res.json();

  if (!json.success) throw new Error(json.error);
  return json.data;
}
