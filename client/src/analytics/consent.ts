// BF_WEBSITE_v789_CONSENT
// What runs before and after the visitor answers the cookie banner.
//
// Before a choice (and after Decline): Google Consent Mode stays at the
// denied defaults set in /js/head-init.js, Microsoft Clarity is not loaded,
// and our own journey / site-behaviour tracking does not start.
// After Accept (now, or on a later visit when the stored choice is Accept):
// Consent Mode is updated to granted, Clarity is loaded, and every callback
// registered with onAnalyticsConsent() runs once.
import { consentChoice } from "@/utils/session";

export const CLARITY_PROJECT_ID = "vjz4kr9hqu";

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };

let clarityLoaded = false;

export function loadClarity(): void {
  if (clarityLoaded || typeof window === "undefined" || typeof document === "undefined") return;
  clarityLoaded = true;
  const w = window as unknown as { clarity?: ClarityFn };
  if (!w.clarity) {
    const queue: ClarityFn = function (this: unknown) {
      // eslint-disable-next-line prefer-rest-params
      (queue.q = queue.q || []).push(arguments);
    };
    w.clarity = queue;
  }
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  document.head.appendChild(script);
}

let granted = false;
const waiting: Array<() => void> = [];

function run(fn: () => void) {
  try {
    fn();
  } catch {
    /* tracking must never break the site */
  }
}

export function hasAnalyticsConsent(): boolean {
  return granted || consentChoice() === "granted";
}

// Called by the consent banner on Accept, and on load when the stored choice
// is Accept.
export function grantAnalyticsConsent(): void {
  granted = true;
  loadClarity();
  waiting.splice(0).forEach(run);
}

// Runs fn now if consent is already granted, otherwise on Accept. Returns an
// unsubscribe for effect cleanup.
export function onAnalyticsConsent(fn: () => void): () => void {
  if (hasAnalyticsConsent()) {
    run(fn);
    return () => {};
  }
  waiting.push(fn);
  return () => {
    const i = waiting.indexOf(fn);
    if (i >= 0) waiting.splice(i, 1);
  };
}
