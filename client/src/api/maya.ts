import { apiGet, apiPost } from "@/lib/apiClient";

const mayaEnabled = import.meta.env.VITE_MAYA_ENABLED === "true";
const mayaApiBase = (import.meta.env.VITE_MAYA_API_BASE ?? "").trim().replace(/\/+$/, "");

export function isMayaConfigured() {
  return mayaEnabled && Boolean(mayaApiBase);
}

export function buildMayaWebSocketUrl(path: string) {
  if (!isMayaConfigured()) {
    return null;
  }

  const pathWithSlash = path.startsWith("/") ? path : `/${path}`;
  const wsBase = mayaApiBase.replace(/^http:/i, "ws:").replace(/^https:/i, "wss:");
  return `${wsBase}${pathWithSlash}`;
}

export async function checkMayaHealth(_signal?: AbortSignal): Promise<boolean> {
  try {
    await apiGet<{ healthy: boolean }>("/api/maya/health");
    return true;
  } catch (error) {
    console.error("MAYA HEALTH ERROR:", error);
    return false;
  }
}

export async function sendMayaMessage(message: string) {
  return apiPost<{ reply?: string }>("/api/maya/message", { message });
}
