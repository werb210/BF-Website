// BF_WEBSITE_BLOCK_v201_GA4_ID_FALLBACK: GA4 collection must not silently die
// when a build ships without VITE_GA_ID. The env still wins if present;
// otherwise fall back to the known BF measurement ID so collection always runs.
const GA_MEASUREMENT_ID =
  (import.meta.env.VITE_GA_ID as string | undefined) || "G-T6LN8Y3L3Z"; // BF_WEBSITE_TAGS_v15 - the previous measurement id belonged to a property
// this account cannot open, so nobody could read the data or mark key events.
// This is the property named "Boreal Financial - Website", which Todd owns.

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

  // BF_WEBSITE_TAGS_v15 - no script injection here. index.html already loads
  // gtag.js for the Ads tag, and gtag("config", <GA4 id>) below makes that same
  // library fetch this property. Injecting a second <script> for the same id
  // downloaded 183 KiB twice on every page view.

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
