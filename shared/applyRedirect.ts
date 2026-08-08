// BF_WEBSITE_CONTACT_REDIRECT_v151
/** Mirrors ATTRIBUTION_KEY in client/src/main.tsx. Guarded by a test. */
export const ATTRIBUTION_STORAGE_KEY = "boreal_attribution";

/** Mirrors FORWARD in the main.tsx click interceptor. Guarded by a test. */
export const FORWARDED_PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "gclid", "gbraid", "wbraid", "li_fat_id",
] as const;

const ALLOWED_REDIRECT_HOSTS = ["client.boreal.financial"];

export function readStoredAttribution(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object"
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

/**
 * Returns the URL the Continue button should navigate to.
 * Falls back to "/" whenever the redirect is missing, malformed, not HTTPS,
 * or points somewhere other than the application host.
 */
export function resolveContactRedirect(
  redirect: string | null | undefined,
  attribution: Record<string, unknown> = {},
): string {
  if (!redirect) return "/";

  let url: URL;
  try {
    url = new URL(redirect);
  } catch {
    return "/";
  }

  if (url.protocol !== "https:") return "/";
  if (!ALLOWED_REDIRECT_HOSTS.includes(url.hostname)) return "/";

  for (const key of FORWARDED_PARAMS) {
    const value = attribution[key];
    if (typeof value === "string" && value.trim() && !url.searchParams.has(key)) {
      url.searchParams.set(key, value.trim());
    }
  }

  return url.toString();
}
