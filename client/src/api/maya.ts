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
    const res = await apiGet<{ healthy: boolean }>("/api/maya/health");
    if (!res.healthy) {
      console.error("MAYA_ERROR:", "Unhealthy response from /api/maya/health");
      return false;
    }

    return true;
  } catch (error) {
    console.error("MAYA_ERROR:", error);
    return false;
  }
}

export async function sendMayaMessage(message: string) {
  try {
    const res = await apiPost<{ reply?: string }>("/api/maya/message", { message });
    return res;
  } catch (error) {
    console.error("MAYA_ERROR:", error);
    throw error;
  }
}
