declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

let sessionScore = 0;

export const trackEvent = (
  eventName: string,
  payload: Record<string, unknown> = {},
) => {
  if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      timestamp: Date.now(),
      ...payload,
    });
  }
};

function classifySessionIntent() {
  if (sessionScore >= 10) return "high_intent";
  if (sessionScore >= 5) return "medium_intent";
  return "low_intent";
}

export const trackConversion = (
  type: string,
  payload: Record<string, unknown> = {},
) => {
  sessionScore += 1;
  trackEvent("conversion", {
    conversion_type: type,
    session_intent: classifySessionIntent(),
    session_score: sessionScore,
    ...payload,
  });
};

export const trackLeadProfile = (profile: {
  strength: "strong" | "moderate" | "weak";
  industry?: string;
  capital_range?: string;
  collateral_type?: string;
}) => {
  trackEvent("lead_profile", profile);
};

export const estimateCommissionValue = (capitalRange: string): number => {
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

  return (ranges[capitalRange] || 100000) * 0.03;
};

export {};
