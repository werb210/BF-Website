import { apiPost } from "@/lib/apiClient";

const mayaEnabled = import.meta.env.VITE_MAYA_ENABLED === "true";
const mayaWsBase = (import.meta.env.VITE_MAYA_WS_BASE ?? "").trim().replace(/\/+$/, "");

export function isMayaConfigured() {
  return mayaEnabled && Boolean(mayaWsBase);
}

export function buildMayaWebSocketUrl(path: string) {
  if (!isMayaConfigured()) {
    return null;
  }

  const pathWithSlash = path.startsWith("/") ? path : `/${path}`;
  return `${mayaWsBase}${pathWithSlash}`;
}

export async function checkMayaHealth(_signal?: AbortSignal): Promise<boolean> {
  return isMayaConfigured();
}

export async function sendMayaMessage(message: string) {
  return apiPost<{ reply?: string }>("maya-message", { message });
}
