import api from "@/core/apiClient";
import { captureAttribution } from "@/core/attribution";

export type MayaWebsiteResponse = {
  reply: string;
  startup_unavailable?: boolean;
  min_rate?: number;
  max_rate?: number;
};

export async function sendMessage(message: string) {
  return api.post<MayaWebsiteResponse>("/maya/website-chat", {
    message,
    attribution: captureAttribution(),
  });
}

export async function escalateToFundingSpecialist() {
  return api.post<{ ok: boolean }>("/maya/escalate", {
    attribution: captureAttribution(),
  });
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
  return api.get<{ faqs: Array<{ question: string; answer: string }> }>("/maya/faq");
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
