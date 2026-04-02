import { getEnv } from "@/config/env";
import { api } from "@/lib/api";

const env = getEnv();
const mayaEnabled = env.VITE_MAYA_ENABLED;
const mayaWsBase = env.VITE_MAYA_WS_BASE.trim().replace(/\/+$/, "");

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
  return api("/maya-message", {
    method: "POST",
    body: JSON.stringify({ message }),
  }) as Promise<{ reply?: string }>;
}
