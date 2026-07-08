// BF_WEBSITE_VISITOR_JOURNEY_v1 - anonymous journey tracker. Assigns a durable session id
// on first visit, records each pageview with dwell time, and flushes beacons to
// BF-Server. The same session id is forwarded to the client wizard on Apply, so the
// pre-application journey can be stitched to the CRM contact after they submit.
// Fails silently: tracking must never break the site.
const SESSION_KEY = "boreal_journey_session";
const ATTRIBUTION_KEY = "boreal_attribution";
const ENDPOINT = "https://server.boreal.financial/api/track/journey";

type JourneyEvent = { type: string; path?: string; title?: string; step?: string; dwellMs?: number; meta?: unknown };

export function getJourneySessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = (window.crypto?.randomUUID?.() ?? `s_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function attribution(): Record<string, unknown> {
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

let queue: JourneyEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function post(body: unknown, useBeacon = false): void {
  try {
    const json = JSON.stringify(body);
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([json], { type: "application/json" }));
      return;
    }
    void fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: json, keepalive: true }).catch(() => {});
  } catch { /* never break the page */ }
}

export function flushJourney(useBeacon = false): void {
  if (typeof window === "undefined" || queue.length === 0) return;
  const events = queue;
  queue = [];
  post({ sessionId: getJourneySessionId(), attribution: attribution(), events }, useBeacon);
}

export function trackJourney(event: JourneyEvent): void {
  if (typeof window === "undefined") return;
  queue.push(event);
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => flushJourney(false), 2000);
}

let currentPath: string | null = null;
let enteredAt = 0;

// Records dwell time on the page being left, then opens the next pageview.
export function trackPageview(path: string, title?: string): void {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (currentPath !== null) {
    trackJourney({ type: "pageview", path: currentPath, title: document.title, dwellMs: now - enteredAt });
  }
  currentPath = path;
  enteredAt = now;
}

export function initJourneyTracking(): void {
  if (typeof window === "undefined") return;
  getJourneySessionId();
  trackPageview(window.location.pathname);
  // Close out the final pageview (and its dwell) when the tab goes away.
  const finalize = () => {
    if (currentPath !== null) {
      queue.push({ type: "pageview", path: currentPath, title: document.title, dwellMs: Date.now() - enteredAt });
      currentPath = null;
    }
    flushJourney(true);
  };
  window.addEventListener("pagehide", finalize);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") finalize(); });
}
