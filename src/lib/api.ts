export async function apiCall(path: string, options: RequestInit = {}) {
  const base =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "https://server.boreal.financial";
  const token = localStorage.getItem("token");
  const incomingHeaders = (options.headers as Record<string, string>) || {};
  const body =
    options.body && typeof options.body === "object" && !(options.body instanceof FormData)
      ? JSON.stringify(options.body)
      : options.body;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...incomingHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${base}${path}`, {
    ...options,
    body,
    headers,
    credentials: "include",
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || "API error");
  }

  if (path === "/api/auth/otp/verify") {
    const verifiedToken = json?.data?.token || json?.token;
    if (verifiedToken) {
      localStorage.setItem("token", verifiedToken);
    }
  }

  if (json?.status === "ok") {
    return json?.data ?? json;
  }

  throw new Error("API error");
}

export const api = apiCall;
