import { getEnv } from "@/config/env";

export async function api(path: string, options: RequestInit = {}) {
  const { VITE_API_URL } = getEnv();

  const res = await fetch(`${VITE_API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const json = await res.json();

  if (!json || typeof json !== "object" || !("status" in json)) {
    console.error("INVALID API RESPONSE:", json);
    throw new Error("Invalid API response");
  }

  if (json.status !== "ok") {
    console.error("API ERROR:", json);
    throw new Error(("error" in json && typeof json.error === "string" && json.error) || "API error");
  }

  return json.data;
}
