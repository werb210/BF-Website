const rawApiBaseUrl = import.meta.env.VITE_API_URL;

if (!rawApiBaseUrl || typeof rawApiBaseUrl !== "string" || !rawApiBaseUrl.trim()) {
  throw new Error("Missing required VITE_API_URL environment variable");
}

const normalizedApiBaseUrl = rawApiBaseUrl.trim().replace(/\/+$/, "");

let validatedApiBaseUrl: string;

try {
  validatedApiBaseUrl = new URL(normalizedApiBaseUrl).toString().replace(/\/+$/, "");
} catch (error) {
  console.error("API_CONFIG_ERROR:", error);
  throw new Error(`Invalid VITE_API_URL value: ${rawApiBaseUrl}`);
}

export const API_BASE_URL = validatedApiBaseUrl;
