export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  url = url.replace(/([^:]\/)\/+/g, "$1");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (!headers["x-request-id"]) {
    headers["x-request-id"] = `rid-${Math.random().toString(36).slice(2, 10)}`;
  }

  if (!headers["Authorization"] && typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
