export async function apiCall(path: string, options: RequestInit = {}) {
  const base = import.meta.env.VITE_API_URL;
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

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "API error");
  }

  if (path === "/api/auth/otp/verify") {
    const verifiedToken = data?.data?.token || data?.token;
    if (verifiedToken) {
      localStorage.setItem("token", verifiedToken);
    }
  }

  return data;
}

export const api = apiCall;
