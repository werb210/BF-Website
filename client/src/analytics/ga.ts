// BF_WEBSITE_BLOCK_v201_GA4_ID_FALLBACK: GA4 collection must not silently die
// when a build ships without VITE_GA_ID. The env still wins if present;
// otherwise fall back to the known BF measurement ID so collection always runs.
const GA_MEASUREMENT_ID =
  (import.meta.env.VITE_GA_ID as string | undefined) || "G-D1Y4105RXP"; // BF_WEBSITE_GA4_FALLBACK_v1 - public GA4 id; ensures the marketing site reports even when VITE_GA_ID is unset at build time

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function initGA() {
  if (initialized || typeof window === "undefined" || !GA_MEASUREMENT_ID) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    const dataLayer = window.dataLayer || [];
    dataLayer.push(args);
    window.dataLayer = dataLayer;
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: true });
  initialized = true;
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag || !GA_MEASUREMENT_ID) {
    return;
  }

  window.gtag("event", eventName, params);
}

export function trackPageView(path: string) {
  trackEvent("page_view", { page_path: path });
}
