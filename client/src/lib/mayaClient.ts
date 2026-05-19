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

export async function checkMayaHealth(signal?: AbortSignal): Promise<boolean> {
  if (!isMayaConfigured()) return false;
  try {
    const response = await fetch(`${getMayaApiBase()}/health`, { method: "GET", signal });
    return response.ok;
  } catch {
    return false;
  }
}
