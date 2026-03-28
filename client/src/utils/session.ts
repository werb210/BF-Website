export const READINESS_SESSION_STORAGE_KEY = "boreal_readiness_session";

export function getReadinessSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(READINESS_SESSION_STORAGE_KEY);
}

export function setReadinessSessionToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(READINESS_SESSION_STORAGE_KEY, token);
}

export function buildApplyUrl(baseUrl: string, readinessSessionToken?: string | null) {
  const canUseWindowOrigin = typeof window !== "undefined";
  const resolvedBaseUrl = baseUrl.startsWith("http")
    ? baseUrl
    : `${canUseWindowOrigin ? window.location.origin : "https://borealfinancial.com"}${baseUrl.startsWith("/") ? "" : "/"}${baseUrl}`;

  const url = new URL(resolvedBaseUrl);

  if (readinessSessionToken) {
    url.searchParams.set("sessionId", readinessSessionToken);
    url.searchParams.set("readinessSession", readinessSessionToken);
  }

  if (baseUrl.startsWith("http")) {
    return url.toString();
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
