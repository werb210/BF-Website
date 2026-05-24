const mayaEnabled = import.meta.env.VITE_MAYA_ENABLED === "true";
// BFW_BLOCK_v152_TALK_HUMAN_COPY_AND_ISSUE_ROUTE_v1 — health check now
// falls back to BF-Server origin when VITE_MAYA_API_BASE isn't set.
const mayaApiBase = (import.meta.env.VITE_MAYA_API_BASE ?? "https://server.boreal.financial").trim();

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

export function isMayaConfigured() {
  // BFW_BLOCK_v152_TALK_HUMAN_COPY_AND_ISSUE_ROUTE_v1 — Maya is "configured"
  // as long as we have an origin to call. Talk-to-Human + Report-an-Issue
  // still work even if the AI chat endpoint is down, because escalations
  // go to BF-Server directly.
  return Boolean(mayaApiBase);
}
void mayaEnabled;

export function getMayaApiBase() {
  return normalizeBaseUrl(mayaApiBase);
}

export async function checkMayaHealth(signal?: AbortSignal): Promise<boolean> {
  if (!isMayaConfigured()) return false;
  try {
    const response = await fetch(`${getMayaApiBase()}/health`, { method: "GET", signal });
    return response.ok;
  } catch {
    return false;
  }
}

// BF_WEBSITE_BLOCK_v83_LAUNCH_POLISH_v1 — Maya escalation client.
const MAYA_ESCALATE_URL = `${import.meta.env.VITE_MAYA_API_BASE ?? "https://server.boreal.financial"}/api/maya/escalate`;

export async function escalateToHuman(opts: { message: string; email?: string; phone?: string; conversationId?: string }) {
  const res = await fetch(MAYA_ESCALATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind: "talk_to_human",
      message: opts.message,
      contact: { email: opts.email, phone: opts.phone },
      conversation_id: opts.conversationId,
      source: "bf-website",
    }),
  });
  if (!res.ok) throw new Error(`escalate failed: ${res.status}`);
  return res.json();
}

export async function reportIssue(opts: { description: string; screenshotDataUrl?: string; email?: string; phone?: string; url?: string }) {
  const res = await fetch(MAYA_ESCALATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind: "report_issue",
      description: opts.description,
      screenshot_data_url: opts.screenshotDataUrl,
      contact: { email: opts.email, phone: opts.phone },
      page_url: opts.url ?? (typeof window !== "undefined" ? window.location.href : ""),
      source: "bf-website",
    }),
  });
  if (!res.ok) throw new Error(`report_issue failed: ${res.status}`);
  return res.json();
}
