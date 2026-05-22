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
  text: string,
  opts?: SendMessageOptions,
): Promise<MayaWebsiteResponse> {
  const response = await api.post<MayaWebsiteResponse>(
    "/maya/website-chat",
    {
      message: text,
      sessionId: opts?.sessionId,
      attribution: captureAttribution(),
    },
    MAYA_HEADERS,
  );

  return response.data;
}

// BF_WEBSITE_BLOCK_v85_MAYA_WIRING_FIX_v1
// Canonical /api/maya/escalate path (v220/v222) needs kind-discriminated
// body. Server fires Twilio SMS to available staff (or MAYA_FALLBACK_SMS_NUMBERS
// env CSV after-hours) and persists to communications_conversations so the
// handoff appears in the staff portal Messages tab.
export async function escalateToFundingSpecialist(
  opts: EscalationOptions & { contact?: { phone?: string | null; email?: string | null }; conversationId?: string } = {},
): Promise<{ ok: boolean; conversation_id?: string }> {
  const response = await api.post<{ ok: boolean; conversation_id?: string }>(
    "/maya/escalate",
    {
      kind: "talk_to_human",
      message: opts.summary && opts.summary.trim() ? opts.summary : "Website visitor requested a human.",
      contact: {
        phone: opts.contact?.phone ?? null,
        email: opts.contact?.email ?? null,
      },
      conversation_id: opts.conversationId,
      // Kept for analytics / dedup downstream:
      sessionId: opts.sessionId,
      surface: opts.surface,
      silo: opts.silo,
      attribution: captureAttribution(),
    },
    MAYA_HEADERS,
  );

  return response.data;
}

// BF_WEBSITE_BLOCK_v85_MAYA_WIRING_FIX_v1 — /maya/issue did not exist.
// Route to /maya/escalate with kind=report_issue (v220/v222).
export async function reportIssue(
  opts: ReportIssueOptions & { contact?: { phone?: string | null; email?: string | null }; pageUrl?: string | null },
): Promise<{ ok: boolean; issue_id?: string }> {
  const response = await api.post<{ ok: boolean; issue_id?: string }>(
    "/maya/escalate",
    {
      kind: "report_issue",
      description: opts.message,
      page_url: opts.pageUrl ?? (typeof window !== "undefined" ? window.location.href : null),
      contact: {
        phone: opts.contact?.phone ?? null,
        email: opts.contact?.email ?? null,
      },
      sessionId: opts.sessionId,
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
