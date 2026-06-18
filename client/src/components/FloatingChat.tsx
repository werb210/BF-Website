import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X } from "lucide-react";
import { getReadinessSessionToken } from "@/utils/session";
import { checkMayaHealth, isMayaConfigured } from "@/lib/mayaClient";
import {
  sendMessage,
  escalateToFundingSpecialist,
  fetchConversationMessages,
  postConversationMessage,
  type MayaWebsiteResponse,
} from "@/services/mayaService";

type ChatMessage = {
  id: string;
  message: string;
  from: "system" | "user";
};

function createSessionId() {
  return `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chat" | "report" | "lead">("chat");
  const [lead, setLead] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [leadDraft, setLeadDraft] = useState<{ name: string; email: string; phone: string }>({ name: "", email: "", phone: "" });
  const [leadError, setLeadError] = useState<string | null>(null);
  const [issue, setIssue] = useState("");
  const [issueShot, setIssueShot] = useState<string | null>(null);
  const [issueShotBusy, setIssueShotBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  // BF_WEBSITE_BLOCK_v87_TWO_WAY_MESSENGER_v1
  const [conversationId, setConversationId] = useState<string | null>(null);
  const seenStaffIds = useRef<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [healthChecked, setHealthChecked] = useState(false);
  const healthAbortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sessionId = useMemo(() => getReadinessSessionToken() ?? createSessionId(), []);

  useEffect(() => {
    if (!open || messages.length > 0) return;
    setMessages([
      {
        id: createSessionId(),
        from: "system",
        message:
          "Hi — I'm Maya. How can I help?",
      },
    ]);
  }, [open, messages.length]);

  useEffect(() => {
    if (!isMayaConfigured()) {
      setIsOnline(false);
      setHealthChecked(true);
      return;
    }
    healthAbortRef.current?.abort();
    const ctrl = new AbortController();
    healthAbortRef.current = ctrl;
    checkMayaHealth(ctrl.signal)
      .then((ok) => {
        setIsOnline(ok);
        setHealthChecked(true);
      })
      .catch(() => {
        setIsOnline(false);
        setHealthChecked(true);
      });
    return () => ctrl.abort();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // BF_WEBSITE_BLOCK_v87_TWO_WAY_MESSENGER_v1 — after escalation, poll the
  // shared thread so staff replies (direction='outbound') land in the same
  // window. Dedup by message id.
  useEffect(() => {
    if (!conversationId) return;
    let active = true;
    const poll = async () => {
      try {
        const list = await fetchConversationMessages(conversationId);
        if (!active) return;
        const fresh = list.filter(
          (m) => m.direction === "outbound" && !seenStaffIds.current.has(m.id),
        );
        if (fresh.length) {
          fresh.forEach((m) => seenStaffIds.current.add(m.id));
          setMessages((prev) => [
            ...prev,
            ...fresh.map((m) => ({ id: m.id, from: "system" as const, message: m.body })),
          ]);
        }
      } catch {
        /* transient — next tick retries */
      }
    };
    void poll();
    const timer = setInterval(poll, 4000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [conversationId]);

  async function handleSend(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((prev) => [...prev, { id: createSessionId(), from: "user", message: text }]);
    setSending(true);
    try {
      // BF_WEBSITE_BLOCK_v87_TWO_WAY_MESSENGER_v1 — once escalated, post into
      // the shared conversation; a human (not Maya) answers via the poll.
      if (conversationId) {
        await postConversationMessage(conversationId, text);
        return;
      }
      const res: MayaWebsiteResponse = await sendMessage(text, { sessionId });
      const reply =
        (res?.reply ?? "").toString().trim() || "Thanks — a Boreal advisor will reach out.";
      setMessages((prev) => [...prev, { id: createSessionId(), from: "system", message: reply }]);
    } catch (err) {
      // BF_WEBSITE_BLOCK_v153_MOBILE_FIRST_LAUNCH_v1 — surface a more
      // diagnostic message in dev, keep the user-friendly fallback in
      // production. Pre-fix the same line fired regardless of cause.
      const detail = err instanceof Error ? err.message : "";
      if (import.meta.env.DEV && detail) {
        console.warn("[Maya chat] failed:", detail);
      }
      setMessages((prev) => [
        ...prev,
        {
          id: createSessionId(),
          from: "system",
          message: "I'm having trouble reaching Maya right now. Tap Talk to a Human and an advisor will follow up shortly.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function requestHumanSupport() {
    if (lead) {
      void escalateNow(lead);
      return;
    }
    setLeadError(null);
    setMode("lead");
  }

  async function submitLead() {
    const name = leadDraft.name.trim();
    const email = leadDraft.email.trim();
    const phone = leadDraft.phone.trim();
    if (!name) { setLeadError("Please enter your name."); return; }
    if (!email && !phone) { setLeadError("Please enter an email or phone."); return; }
    const captured = { name, email, phone };
    setLead(captured);
    setMode("chat");
    setMessages((prev) => [
      ...prev,
      { id: createSessionId(), from: "user", message: `[I'm ${name}${email ? ` — ${email}` : ""}${phone ? ` — ${phone}` : ""}]` },
    ]);
    await escalateNow(captured);
  }

  async function escalateNow(contact: { name: string; email: string; phone: string }) {
    setMessages((prev) => [
      ...prev,
      { id: createSessionId(), from: "user", message: "[requested live human support]" },
    ]);
    try {
      const esc = await escalateToFundingSpecialist({
        sessionId,
        surface: "website",
        silo: "BF",
        contact,
        conversationId: conversationId ?? undefined,
        summary: messages
          .slice(-6)
          .map((m) => `${m.from === "user" ? "Visitor" : "Maya"}: ${m.message}`)
          .join("\n"),
      });
      // BF_WEBSITE_BLOCK_v87_TWO_WAY_MESSENGER_v1 — capturing the thread id
      // flips the widget into two-way mode (poll + posts go to the thread).
      if (esc?.conversation_id) setConversationId(esc.conversation_id);
      // BFW_BLOCK_v152_TALK_HUMAN_COPY_AND_ISSUE_ROUTE_v1 — escalation always
      // logs to BF-Server's conversations table even if no staff is online
      // (the SMS notify is best-effort + has env-fallback). Show a real
      // success message; never tell the user to email us.
      setMessages((prev) => [
        ...prev,
        {
          id: createSessionId(),
          from: "system",
          message:
            "✓ Got it — your message is in our queue. A Boreal advisor will text you back at " +
            (contact.phone || contact.email) +
            ". You can keep typing here too; we'll see everything.",
        },
      ]);
    } catch {
      // Network error only — message wasn't actually saved.
      setMessages((prev) => [
        ...prev,
        {
          id: createSessionId(),
          from: "system",
          message: "Network hiccup — your last message didn't save. Try sending it again.",
        },
      ]);
    }
  }

  async function reportIssue() {
    setMode("report");
    setIssue("");
    setIssueShot(null);
    setIssueShotBusy(true);
    try {
      // BFW_BLOCK_v151_HTML2CANVAS_TYPE_CAST_v1 — the vendored
      // html2canvas/index.d.ts only declares (element). Runtime impl
      // accepts options. Cast once at import so the call site stays clean.
      const html2canvas = (await import("html2canvas")).default as unknown as (
        element: HTMLElement,
        options?: Record<string, unknown>,
      ) => Promise<HTMLCanvasElement>;
      const target = (document.body.querySelector("main") as HTMLElement) ?? document.body;
      const canvas = await html2canvas(target, { useCORS: true, backgroundColor: "#0b1226", scale: Math.min(window.devicePixelRatio || 1, 2), logging: false });
      const MAX_W = 1600;
      let finalCanvas: HTMLCanvasElement = canvas;
      if (canvas.width > MAX_W) {
        const ratio = MAX_W / canvas.width;
        const c2 = document.createElement("canvas");
        c2.width = MAX_W;
        c2.height = Math.round(canvas.height * ratio);
        const ctx = c2.getContext("2d");
        if (ctx) {
          ctx.drawImage(canvas, 0, 0, c2.width, c2.height);
          finalCanvas = c2;
        }
      }
      setIssueShot(finalCanvas.toDataURL("image/jpeg", 0.7));
    } catch (err) {
      console.error("[FloatingChat] screenshot capture failed", err);
      setIssueShot(null);
    } finally {
      setIssueShotBusy(false);
    }
  }

  async function submitIssue() {
    const text = issue.trim();
    if (!text) return;
    const shot = issueShot;
    setIssue("");
    try {
      const { reportIssue: reportIssueFn } = await import("@/services/mayaService");
      await reportIssueFn({
        sessionId,
        message: text,
        screenshot: shot ?? undefined,
        pageUrl: typeof window !== "undefined" ? window.location.href : null,
      });
      setIssueShot(null);
      setMessages((prev) => [
        ...prev,
        { id: createSessionId(), from: "system", message: shot ? "✓ Thanks — your issue and a screenshot were logged." : "✓ Thanks — your issue was logged." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createSessionId(),
          from: "system",
          message: "Couldn't submit the issue — please try again.",
        },
      ]);
    }
    setMode("chat");
  }

  const chatUi = (
    <>
      {open ? (
        <div className="chat-panel fixed inset-0 z-[70] flex h-[100dvh] w-full flex-col overflow-hidden border border-white/20 bg-[#08132a] shadow-2xl pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] md:inset-auto md:bottom-20 md:right-4 md:h-[min(75vh,620px)] md:w-[min(90vw,420px)] md:rounded-2xl md:p-0">
          <div className="chat-header flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Maya</p>
              <p className="text-xs text-slate-300">{isOnline === false ? "Chat offline" : "Online"}</p>
            </div>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded p-1 hover:bg-white/10"
            >
              <X size={16} />
            </button>
          </div>
          <div ref={scrollRef} className="chat-messages flex-1 space-y-2 overflow-y-auto p-4 text-sm">
            {isOnline === false && healthChecked ? (
              <p className="text-amber-300">Chat offline. Please contact us directly.</p>
            ) : null}
            {messages.map((item) => (
              <div
                key={item.id}
                className={`max-w-[80%] break-words rounded-lg px-3 py-2 ${item.from === "user" ? "ml-8 bg-blue-600 text-white" : "mr-8 bg-[#0f1d3a] text-slate-100"}`}
              >
                {item.message}
              </div>
            ))}
            {sending ? <p className="text-xs text-slate-400">Maya is typing…</p> : null}
          </div>

          {mode === "lead" ? (
            <div className="flex flex-col gap-2 border-t border-white/10 px-3 py-2 md:px-4">
              <div className="text-xs text-slate-300">
                A Boreal advisor will reply. Tell us how to reach you:
              </div>
              <input className="rounded border border-white/20 bg-[#0f1d3a] p-2 text-sm text-white placeholder:text-slate-400" placeholder="Your name" value={leadDraft.name} onChange={(e) => setLeadDraft({ ...leadDraft, name: e.target.value })} autoFocus />
              <input className="rounded border border-white/20 bg-[#0f1d3a] p-2 text-sm text-white placeholder:text-slate-400" placeholder="Email" type="email" value={leadDraft.email} onChange={(e) => setLeadDraft({ ...leadDraft, email: e.target.value })} />
              <input className="rounded border border-white/20 bg-[#0f1d3a] p-2 text-sm text-white placeholder:text-slate-400" placeholder="Phone" type="tel" value={leadDraft.phone} onChange={(e) => setLeadDraft({ ...leadDraft, phone: e.target.value })} />
              {leadError ? <div className="text-xs text-red-400">{leadError}</div> : null}
              <div className="flex gap-2">
                <button type="button" onClick={() => setMode("chat")} className="flex-1 rounded border border-white/20 px-3 py-2 text-sm">Cancel</button>
                <button type="button" onClick={() => void submitLead()} className="flex-1 rounded bg-blue-600 px-3 py-2 text-sm text-white">Start chat</button>
              </div>
            </div>
          ) : mode === "report" ? (
            <div className="flex flex-col gap-2 border-t border-white/10 px-3 py-2 md:px-4">
              <textarea
                className="w-full rounded border border-white/20 bg-[#0f1d3a] p-2 text-sm text-white"
                rows={3}
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Describe the issue…"
              />
              <div className="text-xs text-slate-400">
                {issueShotBusy
                  ? "Capturing screenshot…"
                  : issueShot
                  ? "Screenshot attached (will be sent)"
                  : "No screenshot captured — text-only report"}
              </div>
              {issueShot ? (
                <img alt="Screenshot of this page" src={issueShot} style={{ maxHeight: 80, borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)" }} />
              ) : null}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setMode("chat"); setIssueShot(null); }}
                  className="flex-1 rounded border border-white/20 px-3 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitIssue}
                  className="flex-1 rounded bg-blue-600 px-3 py-2 text-sm text-white"
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* BF_WEBSITE_BLOCK_v85_MAYA_WIRING_FIX_v1 */}
              <div className="flex gap-2 border-t border-white/10 px-3 py-3 md:px-4">
                <button
                  type="button"
                  onClick={requestHumanSupport}
                  className="flex-1 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Talk to a Human
                </button>
                <button
                  type="button"
                  onClick={reportIssue}
                  className="flex-1 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Report an Issue
                </button>
              </div>
              {/* BF_WEBSITE_BLOCK_v85_MAYA_WIRING_FIX_v1 */}
              <form onSubmit={handleSend} className="flex gap-2 border-t border-white/10 px-3 py-3 md:px-4">
                <input
                  className="flex-1 rounded-xl border border-white/15 bg-[#0f1d3a] px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                  placeholder={isOnline === false ? "Maya is offline — your message will be saved" : "Type a message…"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      ) : null}
      <button
        type="button"
        aria-label="Open chat"
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
      >
        <MessageCircle size={20} />
      </button>
    </>
  );

  if (typeof document === "undefined") return null;
  return createPortal(chatUi, document.body);
}
