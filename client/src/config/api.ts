export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://server.boreal.financial";

/**
 * Standard API wrapper
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    credentials: "include" // REQUIRED
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw data || {
      status: "error",
      error: { message: "request_failed" }
    };
  }

  return data;
}
