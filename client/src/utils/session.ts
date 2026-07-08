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
  const url = new URL(baseUrl);
  if (readinessSessionToken) {
    url.searchParams.set("sessionId", readinessSessionToken);
    url.searchParams.set("readinessSession", readinessSessionToken);
  }
  // BF_WEBSITE_VISITOR_JOURNEY_v1 - carry the anonymous journey session into the wizard
  // so the pre-application browsing history can be stitched to the CRM contact.
  try {
    const journeyId = typeof window !== "undefined" ? window.localStorage.getItem("boreal_journey_session") : null;
    if (journeyId) url.searchParams.set("journeySession", journeyId);
  } catch { /* ignore */ }
  return url.toString();
}
