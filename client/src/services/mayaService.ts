import api from "@/core/apiClient";
import { captureAttribution } from "@/core/attribution";

// BF_WEBSITE_BLOCK_v_MAYA_AUDIENCE_HEADER_v1
// Public marketing site advertises audience=visitor on every
// Maya call so the agent applies the visitor tool whitelist
// (info.products, info.qualifications, lead.capture,
// apply.start_url). See AGENT_BLOCK_v2.
const MAYA_HEADERS: Record<string, string> = {
  "X-Maya-Audience": "visitor",
};

export type MayaWebsiteResponse = {
  reply: string;
  startup_unavailable?: boolean;
  min_rate?: number;
  max_rate?: number;
};

export async function sendMessage(message: string) {
  return api.post<MayaWebsiteResponse>(
    "/maya/website-chat",
    {
      message,
      attribution: captureAttribution(),
    },
    MAYA_HEADERS,
  );
}

export async function escalateToFundingSpecialist() {
  return api.post<{ ok: boolean }>(
    "/maya/escalate",
    {
      attribution: captureAttribution(),
    },
    MAYA_HEADERS,
  );
}

export async function trackMarketingLead() {
  if (import.meta.env.DEV) {
    return { data: { ok: true } };
  }

  return api.post<{ ok: boolean }>("/marketing/track-lead", {
    utm: captureAttribution(),
    timestamp: Date.now(),
    channel: "website",
  });
}

export async function fetchFaq() {
  // BF_WEBSITE_BLOCK_v_MAYA_AUDIENCE_HEADER_v1
  return api.get<{ faqs: Array<{ question: string; answer: string }> }>(
    "/maya/faq",
    MAYA_HEADERS,
  );
}

export async function joinStartupWaitlist(payload: {
  email: string;
  companyName?: string;
}) {
  return api.post<{ ok: boolean }>("/crm/startup-waitlist", {
    ...payload,
    startup_interest: true,
    channel: "website",
    utm_source: captureAttribution().utm_source,
  });
}
