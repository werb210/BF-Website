import api from "@/core/apiClient";
import { captureAttribution } from "@/core/attribution";

const MAYA_HEADERS: Record<string, string> = {
  "X-Maya-Audience": "visitor",
};

export type MayaWebsiteResponse = {
  reply: string;
  startup_unavailable?: boolean;
  min_rate?: number;
  max_rate?: number;
};

type SendMessageOptions = {
  sessionId?: string;
};

type EscalationOptions = {
  sessionId?: string;
  surface?: string;
  silo?: string;
  summary?: string;
};

type ReportIssueOptions = {
  sessionId?: string;
  message: string;
};

export async function sendMessage(
  message: string,
  opts?: SendMessageOptions,
): Promise<MayaWebsiteResponse> {
  const response = await api.post<MayaWebsiteResponse>(
    "/maya/website-chat",
    {
      message,
      sessionId: opts?.sessionId,
      attribution: captureAttribution(),
    },
    MAYA_HEADERS,
  );

  return response.data;
}

export async function escalateToFundingSpecialist(
  opts: EscalationOptions = {},
): Promise<unknown> {
  const response = await api.post<{ ok: boolean }>(
    "/maya/escalate",
    {
      sessionId: opts.sessionId,
      surface: opts.surface,
      silo: opts.silo,
      summary: opts.summary,
      attribution: captureAttribution(),
    },
    MAYA_HEADERS,
  );

  return response.data;
}

export async function reportIssue(opts: ReportIssueOptions): Promise<unknown> {
  const response = await api.post(
    "/maya/issue",
    {
      sessionId: opts.sessionId,
      message: opts.message,
      attribution: captureAttribution(),
    },
    MAYA_HEADERS,
  );

  return response.data;
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
