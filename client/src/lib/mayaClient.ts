import { apiRequest } from "@/lib/api";

const mayaEnabled = import.meta.env.VITE_MAYA_ENABLED === "true";
const mayaApiBase = (import.meta.env.VITE_MAYA_API_BASE ?? "").trim();

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

export function isMayaConfigured() {
  return mayaEnabled && Boolean(mayaApiBase);
}

export function getMayaApiBase() {
  return normalizeBaseUrl(mayaApiBase);
}

export async function checkMayaHealth(_signal?: AbortSignal): Promise<boolean> {
  if (!isMayaConfigured()) {
    return false;
  }

  const response = await apiRequest(`${getMayaApiBase()}/health`, {
    method: "GET",
  });

  return response.success;
}

export function buildMayaWebSocketUrl(path: string) {
  if (!isMayaConfigured()) {
    return null;
  }

  const base = getMayaApiBase();
  const pathWithSlash = path.startsWith("/") ? path : `/${path}`;
  const wsBase = base.replace(/^http:/i, "ws:").replace(/^https:/i, "wss:");
  return `${wsBase}${pathWithSlash}`;
}
