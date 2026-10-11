import api from "@/core/apiClient";
import { captureAttribution } from "@/core/attribution";
import { conversationHeaders } from "@/lib/conversationToken";
import type { CaslFields } from "@/lib/casl";

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
  contact?: { name?: string; email?: string; phone?: string };
  // BF_WEBSITE_v789_CASL - recorded with the lead the escalation creates.
  casl?: CaslFields;
};

type ReportIssueOptions = {
  sessionId?: string;
  message: string;
  screenshot?: string;
  pageUrl?: string | null;
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
// BF_WEBSITE_v789_CONVERSATION_TOKEN - BF-Server v789 adds visitor_token,
// which gates the public conversation endpoints below.
export type EscalationResult = { ok: boolean; conversation_id?: string; visitor_token?: string };

export async function escalateToFundingSpecialist(
  opts: EscalationOptions & { conversationId?: string } = {},
): Promise<EscalationResult> {
  const response = await api.post<EscalationResult>(
    "/maya/escalate",
    {
      kind: "talk_to_human",
      message: opts.summary && opts.summary.trim() ? opts.summary : "Website visitor requested a human.",
      contact: {
        name: opts.contact?.name ?? null,
        phone: opts.contact?.phone ?? null,
        email: opts.contact?.email ?? null,
      },
      conversation_id: opts.conversationId,
      // Kept for analytics / dedup downstream:
      sessionId: opts.sessionId,
      surface: opts.surface,
      silo: opts.silo,
      attribution: captureAttribution(),
      ...(opts.casl ?? {}),
    },
    MAYA_HEADERS,
  );

  return response.data;
}

// BF_WEBSITE_BLOCK_v85_MAYA_WIRING_FIX_v1 — /maya/issue did not exist.
// Route to /maya/escalate with kind=report_issue (v220/v222).
export async function reportIssue(
  opts: ReportIssueOptions & { contact?: { phone?: string | null; email?: string | null } },
): Promise<{ ok: boolean; issue_id?: string }> {
  // BFW_BLOCK_v152_TALK_HUMAN_COPY_AND_ISSUE_ROUTE_v1 — bypass the agent
  // (whose /maya/issue route was returning 4xx in the live test). Post
  // directly to BF-Server /api/maya/escalate with kind: 'report_issue',
  // same path bf-client uses. BF-Server v645 accepts `screenshot`,
  // `screenshot_base64`, and `screenshot_data_url` as aliases.
  const response = await api.post<{ ok: boolean; issue_id?: string }>(
    "/maya/escalate",
    {
      kind: "report_issue",
      description: opts.message,
      message: opts.message,
      screenshot_data_url: opts.screenshot ?? null,
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

// BF_WEBSITE_BLOCK_v87_TWO_WAY_MESSENGER_v1 — once a visitor is escalated,
// the chat becomes two-way against the same communications_conversations
// thread the staff portal reads/writes. Mirrors bf-client MayaWidget v56.
// Public GET/POST live under /api/public/conversation/:id/* and are
// UUID-token gated. ok() wraps payloads as { status, data }.
export type ConversationMessage = {
  id: string;
  direction: string;
  body: string;
  created_at?: string;
};

export async function fetchConversationMessages(
  conversationId: string,
): Promise<ConversationMessage[]> {
  const r = await api.get<{
    status?: string;
    data?: { messages?: ConversationMessage[] };
    messages?: ConversationMessage[];
  }>(
    `/public/conversation/${encodeURIComponent(conversationId)}/messages`,
    conversationHeaders(conversationId), // BF_WEBSITE_v789_CONVERSATION_TOKEN
  );
  const payload = r.data;
  return payload?.data?.messages ?? payload?.messages ?? [];
}

export async function postConversationMessage(
  conversationId: string,
  body: string,
): Promise<void> {
  await api.post(
    `/public/conversation/${encodeURIComponent(conversationId)}/message`,
    { body },
    conversationHeaders(conversationId), // BF_WEBSITE_v789_CONVERSATION_TOKEN
  );
}
