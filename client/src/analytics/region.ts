// BF_WEBSITE_v868_QUEBEC_CONSENT - is this visitor in Quebec?
//
// Quebec's Law 25 needs consent before Google Analytics / Google Ads cookies are set. Everywhere else Boreal serves
// (the rest of Canada and the US) Google runs on notice, with the banner's Decline as the opt-out. Microsoft Clarity
// and Boreal's own journey / site-behaviour tracking are unchanged: they always wait for Accept (analytics/consent.ts).
//
// /js/head-init.js asks BF-Server (GET /api/privacy/region, 1.5 s at most) before React starts, keeps the answer for
// the browser session (sessionStorage "bf_privacy_region"), grants Google for visitors outside Quebec, and announces
// the region on window.__bfConsentRegion and a "bf-consent-region" event. This module reads that answer for the banner.
export type ConsentRegion = "QC" | "other";

export const REGION_STORAGE_KEY = "bf_privacy_region";
export const REGION_EVENT = "bf-consent-region";
/** The banner waits at most this long for head-init's answer, then uses the browser fallback. */
export const REGION_WAIT_MS = 1600;

type RegionWindow = {
  __bfConsentRegion?: unknown;
  sessionStorage?: Storage;
  addEventListener?: (type: string, fn: (e: Event) => void) => void;
  removeEventListener?: (type: string, fn: (e: Event) => void) => void;
};

function win(): RegionWindow | null {
  return typeof window === "undefined" ? null : (window as unknown as RegionWindow);
}

const isRegion = (v: unknown): v is ConsentRegion => v === "QC" || v === "other";

/**
 * Used only when the server cannot tell. A browser in Quebec reports America/Toronto (America/Montreal is the older
 * name), which also covers Ontario, so the time zone alone cannot pick out Quebec; French (Canada) alongside it nearly
 * always does. That pair is treated as Quebec (a French-speaking Ontarian gets the stricter treatment, which errs on
 * the side of privacy). Anyone else is "other". Mirrors head-init.js.
 */
export function fallbackRegion(timeZone: string | undefined, languages: readonly string[]): ConsentRegion {
  const easternCanada = timeZone === "America/Montreal" || timeZone === "America/Toronto";
  const frenchCanadian = languages.some((l) => String(l).toLowerCase() === "fr-ca");
  return easternCanada && frenchCanadian ? "QC" : "other";
}

function browserFallback(): ConsentRegion {
  let tz: string | undefined;
  let langs: string[] = [];
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { tz = undefined; }
  try {
    const n = (typeof navigator === "undefined" ? {} : navigator) as { languages?: readonly string[]; language?: string };
    langs = [...(n.languages ?? []), n.language ?? ""].filter(Boolean);
  } catch { langs = []; }
  return fallbackRegion(tz, langs);
}

/** The region head-init.js worked out (this page or earlier this session), or null while it is still asking. */
export function knownRegion(): ConsentRegion | null {
  const w = win();
  if (!w) return null;
  if (isRegion(w.__bfConsentRegion)) return w.__bfConsentRegion;
  try {
    const saved = w.sessionStorage?.getItem(REGION_STORAGE_KEY);
    if (isRegion(saved)) return saved;
  } catch { /* storage blocked */ }
  return null;
}

/** Resolves with the region as soon as head-init.js knows it; after `timeoutMs` the browser fallback decides. */
export function waitForRegion(timeoutMs: number = REGION_WAIT_MS): Promise<ConsentRegion> {
  const ready = knownRegion();
  if (ready) return Promise.resolve(ready);
  const w = win();
  return new Promise((resolve) => {
    let done = false;
    const finish = (r: ConsentRegion) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      w?.removeEventListener?.(REGION_EVENT, onEvent);
      resolve(r);
    };
    const onEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      finish(isRegion(detail) ? detail : knownRegion() ?? browserFallback());
    };
    const timer = setTimeout(() => finish(knownRegion() ?? browserFallback()), timeoutMs);
    w?.addEventListener?.(REGION_EVENT, onEvent);
  });
}

/** What the banner says. Quebec: everything waits for Accept. Elsewhere: Google runs until Decline. */
export function consentNotice(region: ConsentRegion): string {
  return region === "QC"
    ? "We'd like to use cookies to see how visitors use this site (Google Analytics and session recordings) and to measure our Google ads. All tracking is off until you accept."
    : "We use cookies to see how visitors use this site and to measure our ads. Google Analytics and Google Ads measurement are on unless you decline. Session recordings and visitor tracking start only if you accept.";
}
