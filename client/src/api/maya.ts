import { apiFetch } from "@/config/api";
import { endpoints } from "@/lib/endpoints";

export const mayaEnabled = true;

export function isMayaConfigured() {
  return mayaEnabled;
}

export function buildMayaWebSocketUrl(_path: string) {
  return null;
}

export async function checkMayaHealth(_signal?: AbortSignal): Promise<boolean> {
  return isMayaConfigured();
}

export async function sendMayaMessage(message: string) {
  return apiFetch(endpoints.mayaMessage, {
    method: "POST",
    body: JSON.stringify({ message })
  });
}
