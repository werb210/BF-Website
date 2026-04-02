import { api } from "@/lib/api";

const mayaEnabled = false;
const mayaWsBase = "";

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
  return api("/api/v1/call/start", {
    method: "POST",
    body: JSON.stringify({ message }),
  }) as Promise<{ reply?: string }>;
}
