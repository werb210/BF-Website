import { env } from "@/config/env";

function getAuthHeader() {
  const token =
    (typeof window !== "undefined" && window.localStorage.getItem("authToken")) ||
    (typeof window !== "undefined" && window.sessionStorage.getItem("authToken"));

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${env.API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
  });

  if (res.status === 503) {
    throw new Error("SERVICE_NOT_READY");
  }

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (res.status === 410) {
    throw new Error("ENDPOINT_DEPRECATED");
  }

  return res;
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const normalizedOptions = {
    ...options,
    body:
      options.body && typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : options.body,
  };

  const res = await apiFetch(path, normalizedOptions);
  const json = await res.json();

  if (!res.ok) {
    const message =
      json && typeof json === "object" && "error" in json && typeof json.error === "string"
        ? json.error
        : `HTTP_${res.status}`;
    throw new Error(message);
  }

  if (json && typeof json === "object" && "status" in json) {
    if (json.status !== "ok") {
      throw new Error(
        ("error" in json && typeof json.error === "string" && json.error) || "API_ERROR"
      );
    }

    return ("data" in json ? json.data : json) as T;
  }

  return json as T;
}
