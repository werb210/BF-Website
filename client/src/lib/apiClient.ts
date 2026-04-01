export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const BASE_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

if (!BASE_URL) {
  throw new Error("MISSING_API_URL");
}

function buildUrl(path: string) {
  if (!path.startsWith("/api/")) {
    throw new Error(`Invalid API path: ${path}`);
  }

  return `${BASE_URL}${path}`;
}

export async function apiPost<T>(path: string, payload?: unknown): Promise<T> {
  if (path === "/api/lead") {
    console.log("LEAD SUBMIT:", payload);
  }

  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (!res.ok) throw new Error("HTTP_ERROR");

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`Invalid API response for ${path}`);
  }

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

  if (!res.ok) throw new Error("HTTP_ERROR");

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`Invalid API response for ${path}`);
  }

  if (!json.success) throw new Error(json.error);

  return json.data;
}
