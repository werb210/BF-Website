import React, { useEffect } from "react";
import { initJourneyTracking } from "@/utils/journey"; // BF_WEBSITE_VISITOR_JOURNEY_v1
import ReactDOM from "react-dom/client";
import App from "./App";
import { initGA } from "./analytics/ga";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import "./styles/global.css";

// BF_WEBSITE_BLOCK_v83_LAUNCH_POLISH_v1 + HOTFIX_LINT_v1 — proper PWA install handling.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

window.addEventListener("beforeinstallprompt", (e: Event) => {
  const evt = e as BeforeInstallPromptEvent;
  evt.preventDefault();
  deferredInstallPrompt = evt;
  window.dispatchEvent(new CustomEvent("bf-pwa-installable", { detail: true }));
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  window.dispatchEvent(new CustomEvent("bf-pwa-installable", { detail: false }));
});

// Exposed helper any component can call from a real user gesture:
declare global {
  interface Window {
    __bfPromptInstall?: () => Promise<{ ok: boolean; reason?: string; outcome?: "accepted" | "dismissed" }>;
  }
}
window.__bfPromptInstall = async () => {
  if (!deferredInstallPrompt) return { ok: false, reason: "not-available" };
  await deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  return { ok: true, outcome: choice.outcome };
};


// ---- Advanced Tracking Layer ----
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export const trackEvent = (eventName: string, payload: Record<string, unknown> = {}) => {
  if (typeof window === "undefined") return;

  const body = { event: eventName, timestamp: Date.now(), ...payload };

  if (window.dataLayer) {
    window.dataLayer.push(body);
  }

  // BF_WEBSITE_TAGS_v15 - every event raised through this helper (conversion,
  // funnel_stage, form_submit, lead_profile, session_summary) was pushed only to
  // dataLayer, and the GTM container on the other end was empty. None of it ever
  // reached an analytics product. gtag is the live path.
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, payload);
  }
};

// ---- Attribution Layer ----
const ATTRIBUTION_KEY = "boreal_attribution";

// BF_WEBSITE_ATTRIBUTION_MERGE_v1
// The marketing params that identify where a visitor came from. Everything else
// stored alongside them (referrer, landing_page, timestamp) is context, not
// signal - a record holding only context tells you nothing about the source.
const MARKETING_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "gclid", "gbraid", "wbraid", "li_fat_id",
] as const;

type AttributionRecord = Record<string, string | number | null>;

function hasMarketingSignal(a: AttributionRecord | null | undefined): boolean {
  if (!a) return false;
  return MARKETING_KEYS.some((k) => {
    const v = a[k];
    return typeof v === "string" && v.trim() !== "";
  });
}

export const captureAttribution = () => {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(window.location.search);

  const attribution: AttributionRecord = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
    gclid: params.get("gclid"),
    gbraid: params.get("gbraid"),
    wbraid: params.get("wbraid"),
    li_fat_id: params.get("li_fat_id"), // BF_WEBSITE_LI_FAT_ID_v1
    referrer: document.referrer || null,
    landing_page: window.location.pathname,
    first_visit_timestamp: Date.now(),
  };

  // BF_WEBSITE_ATTRIBUTION_MERGE_v1
  // This used to be a bare `if (!localStorage.getItem(KEY)) set(...)`, which wrote
  // the record even when every marketing field was null. Consequence, measured in
  // production: any visitor who reached the site once WITHOUT parameters - typed
  // the URL, arrived from organic search, opened a bookmark - had an all-null
  // record written and locked in. When that same person later clicked a Google ad
  // and arrived carrying ?gclid=..., the guard was already satisfied and the gclid
  // was discarded. Every application was therefore attributed to nothing: 28
  // applications over 30 days, zero gclid, zero utm_source, against real ad spend.
  //
  // Auto-tagging was on and the ad Final URL was clean the whole time - Google was
  // appending the gclid correctly and this code threw it away.
  //
  // Two rules now:
  //   1. Never persist a record that carries no marketing signal. Context-only
  //      records (referrer/landing_page) block nothing and are not worth keeping.
  //   2. First-touch marketing source still wins - a later ad click must not
  //      overwrite the campaign that originally introduced the visitor - but any
  //      marketing field MISSING from the stored record is filled in from the
  //      current URL. That is what makes a first-visit-then-ad-click sequence work.
  //
  // Mirrors BF_CLIENT_ATTRIBUTION_MERGE_v1 in bf-client, which fixed this exact
  // failure on the client app and was never applied here.
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    const stored: AttributionRecord | null = raw ? (JSON.parse(raw) as AttributionRecord) : null;

    if (!stored) {
      if (hasMarketingSignal(attribution)) {
        localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
      }
      return;
    }

    // Stored record exists. Fill in only the marketing fields it is missing.
    const merged: AttributionRecord = { ...stored };
    let changed = false;
    for (const k of MARKETING_KEYS) {
      const incoming = attribution[k];
      const existing = merged[k];
      const existingIsSet = typeof existing === "string" && existing.trim() !== "";
      const incomingIsSet = typeof incoming === "string" && incoming.trim() !== "";
      if (!existingIsSet && incomingIsSet) {
        merged[k] = incoming;
        changed = true;
      }
    }
    if (changed) localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(merged));
  } catch {
    // localStorage unavailable or holding malformed JSON. Tracking must never
    // break the site, so fall back to a plain write when there is real signal.
    try {
      if (hasMarketingSignal(attribution)) {
        localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
      }
    } catch { /* give up silently */ }
  }
};

export const getAttribution = () => {
  if (typeof window === "undefined") {
    return {};
  }

  const stored = localStorage.getItem(ATTRIBUTION_KEY);
  return stored ? JSON.parse(stored) : {};
};

// ---- Session Quality Scoring ----
let sessionScore = 0;

export const incrementSessionScore = (points: number) => {
  sessionScore += points;
};

export const classifySessionIntent = () => {
  if (sessionScore >= 10) return "high_intent";
  if (sessionScore >= 5) return "medium_intent";
  return "low_intent";
};

export const trackConversion = (type: string, payload: Record<string, unknown> = {}) => {
  const attribution = getAttribution();
  const intentLevel = classifySessionIntent();

  trackEvent("conversion", {
    conversion_type: type,
    session_intent: intentLevel,
    session_score: sessionScore,
    ...attribution,
    ...payload,
  });
};

export const trackLeadProfile = (profile: {
  strength: "strong" | "moderate" | "weak";
  industry?: string;
  capital_range?: string;
  collateral_type?: string;
}) => {
  trackEvent("lead_profile", {
    ...profile,
  });
};

// ---- Revenue Value Modeling ----
const COMMISSION_RATE = 0.03; // Adjust to real average later

export const estimateCommissionValue = (
  capitalRange: string
): number => {
  const ranges: Record<string, number> = {
    "0-100k": 50000,
    "100k-250k": 175000,
    "250k-500k": 375000,
    "500k-1m": 750000,
    "1m+": 1500000,
    "Zero to $150,000": 75000,
    "$150,001 to $500,000": 325000,
    "$500,001 to $1,000,000": 750000,
    "$1,000,001 to $3,000,000": 2000000,
    "Over $3,000,000": 3000000,
  };

  const midpoint = ranges[capitalRange] || 100000;
  return midpoint * COMMISSION_RATE;
};

function resolveCtaLocation(element: Element): string {
  const locationHints: Array<{ selector: string; location: string }> = [
    { selector: "header, nav, [class*='nav']", location: "nav" },
    { selector: "footer, [class*='footer']", location: "footer" },
    { selector: "[class*='result'], [id*='result']", location: "results_page" },
    { selector: "[class*='hero'], [id*='hero']", location: "hero" },
  ];

  for (const { selector, location } of locationHints) {
    if (element.closest(selector)) {
      return location;
    }
  }

  return "hero";
}

function useScrollTracking() {
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const fired: number[] = [];

    const onScroll = () => {
      const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollableHeight <= 0) {
        return;
      }

      const scrollPercent = (window.scrollY / totalScrollableHeight) * 100;

      milestones.forEach((m) => {
        if (scrollPercent >= m && !fired.includes(m)) {
          fired.push(m);
          incrementSessionScore(1);
          trackEvent("engagement_score", {
            scroll_depth: m,
          });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

function TrackingProvider() {
  useScrollTracking();

  useEffect(() => {
    captureAttribution();
    // BF_WEBSITE_VISITOR_JOURNEY_v1 - start anonymous journey tracking.
    try { initJourneyTracking(); } catch { /* tracking must never break the site */ }
  }, []);

  // BF_WEBSITE_ATTRIBUTION_HANDOFF_v1 - carry utm + gclid to the client app so the
  // application/CRM record is attributed back to the originating ad click.
  useEffect(() => {
    const FORWARD = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "li_fat_id"];
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target && target.closest ? target.closest("a") : null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (!href.includes("client.boreal.financial")) return;
      try {
        const url = new URL(href, window.location.origin);
        const attr = getAttribution() as Record<string, string | null>;
        for (const k of FORWARD) {
          const v = attr[k];
          if (v && !url.searchParams.has(k)) url.searchParams.set(k, String(v));
        }
        a.setAttribute("href", url.toString());
      } catch {
        /* ignore malformed href */
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (window.location.pathname.toLowerCase().includes("credit-results")) {
      incrementSessionScore(4);
      trackEvent("funnel_stage", {
        stage: "credit_results_view",
      });
    }

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) {
        return;
      }

      const clickableElement = target.closest("button, a");
      if (!clickableElement) {
        return;
      }

      const label = clickableElement.textContent?.trim().toLowerCase() ?? "";
      const location = resolveCtaLocation(clickableElement);

      if (label.includes("apply now")) {
        incrementSessionScore(5);
        trackConversion("apply_click", {
          location: "hero",
        });
      }

      if (label.includes("speak with advisor") || label.includes("advisor")) {
        trackEvent("advisor_click", { location });
      }
    };

    const onFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement | null;
      if (!form || form.tagName !== "FORM") {
        return;
      }

      const configuredName = form.getAttribute("data-track-form") || form.getAttribute("name") || form.id;
      const inferredName = window.location.pathname.toLowerCase().includes("credit-readiness")
        ? "credit_readiness"
        : "generic_form";

      if (inferredName === "credit_readiness") {
        incrementSessionScore(3);
      }

      trackEvent("form_submit", {
        form: configuredName || inferredName,
      });
    };

    document.addEventListener("click", onDocumentClick);
    document.addEventListener("submit", onFormSubmit);

    return () => {
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("submit", onFormSubmit);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      trackEvent("session_summary", {
        session_intent: classifySessionIntent(),
        session_score: sessionScore,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <App />;
}

try {
  initGA(); // BF_WEBSITE_GA4_INIT_v1 — start GA4 (G-D1Y4105RXP) before render
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <HelmetProvider>
        <ErrorBoundary>
          <TrackingProvider />
        </ErrorBoundary>
      </HelmetProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.warn("UI snapshot mode", error);
}
