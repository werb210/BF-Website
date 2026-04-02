import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import { env } from "@/config/env";
import { waitForReady } from "@/lib/ready";

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export const trackEvent = (eventName: string, payload: Record<string, unknown> = {}) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      timestamp: Date.now(),
      ...payload,
    });
  }
};

// ---- Attribution Layer ----
let attributionData: Record<string, unknown> = {};

export const captureAttribution = () => {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(window.location.search);

  const attribution = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
    landing_page: window.location.pathname,
    first_visit_timestamp: Date.now(),
  };

  if (Object.keys(attributionData).length === 0) {
    attributionData = attribution;
  }
};

export const getAttribution = () => {
  if (typeof window === "undefined") {
    return {};
  }

  return attributionData;
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

  return (
    <>
      <App />
    </>
  );
}

function renderApp() {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Missing root");
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <ErrorBoundary>
            <TrackingProvider />
          </ErrorBoundary>
        </HelmetProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

async function bootstrap() {
  try {
    void env;
    await waitForReady();
  } catch (e) {
    console.error("BOOTSTRAP FAILED:", e);
    throw e;
  }

  renderApp();
}

void bootstrap();
