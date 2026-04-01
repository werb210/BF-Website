export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const BASE_URL = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");

function buildUrl(path: string) {
  if (!path.startsWith("/api/")) {
    throw new Error(`Invalid API path: ${path}`);
  }

  if (!BASE_URL) {
    throw new Error("VITE_API_URL is not configured");
  }

  return `${BASE_URL}${path}`;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  if (path === "/api/lead") {
    console.log("LEAD SUBMIT:", body);
  }

  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`Invalid API response for ${path}`);
  }

  if (!res.ok) {
    const error = !json.success ? json.error : `HTTP ${res.status}`;
    throw new Error(error);
  }

  if (!json.success) {
    console.error(json.error);
    throw new Error(json.error);
  }

  return json.data;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`Invalid API response for ${path}`);
  }

  if (!res.ok) {
    const error = !json.success ? json.error : `HTTP ${res.status}`;
    throw new Error(error);
  }

  if (!json.success) {
    console.error(json.error);
    throw new Error(json.error);
  }

  return json.data;
}
