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
  // BF_WEBSITE_APPLY_ATTRIBUTION_v1 - forward captured ad/marketing attribution
  // (gclid + utm_*) across the domain hop to client.boreal.financial. Without this
  // the wizard sees a clean URL and every application is attributed to "direct";
  // Google Ads clicks and conversions can never tie back to a funded deal.
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem("boreal_attribution") : null;
    if (raw) {
      const a = JSON.parse(raw) as Record<string, string | null | undefined>;
      const forward = [
        "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
        "gclid", "gbraid", "wbraid", "li_fat_id",
      ];
      for (const k of forward) {
        const v = a?.[k];
        if (v && !url.searchParams.has(k)) url.searchParams.set(k, String(v));
      }
    }
  } catch { /* attribution is non-essential - never break the apply link */ }
  return url.toString();
}
