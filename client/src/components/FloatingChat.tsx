import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X } from "lucide-react";
import { getReadinessSessionToken } from "@/utils/session";
import { checkMayaHealth, isMayaConfigured } from "@/lib/mayaClient";
import {
  sendMessage,
  escalateToFundingSpecialist,
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
  const [mode, setMode] = useState<"chat" | "report">("chat");
  const [issue, setIssue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
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
          "Hi — I'm Maya. Before we get going, what's your name and an email or phone I can use to follow up?",
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

  async function handleSend(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((prev) => [...prev, { id: createSessionId(), from: "user", message: text }]);
    setSending(true);
    try {
      const res: MayaWebsiteResponse = await sendMessage(text, { sessionId });
      const reply =
        (res?.reply ?? "").toString().trim() || "Thanks — a Boreal advisor will reach out.";
      setMessages((prev) => [...prev, { id: createSessionId(), from: "system", message: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createSessionId(),
          from: "system",
          message: "I'm having trouble — please try again, or click Talk to a Human.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  async function requestHumanSupport() {
    setMode("chat");
    setMessages((prev) => [
      ...prev,
      { id: createSessionId(), from: "user", message: "[requested live human support]" },
    ]);
    try {
      await escalateToFundingSpecialist({
        sessionId,
        surface: "website",
        silo: "BF",
        summary: messages
          .slice(-6)
          .map((m) => `${m.from === "user" ? "Visitor" : "Maya"}: ${m.message}`)
          .join("\n"),
      });
      setMessages((prev) => [
        ...prev,
        {
          id: createSessionId(),
          from: "system",
          message:
            "✓ A Boreal advisor has been notified. If we're outside business hours, your message went to our on-call team.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createSessionId(),
          from: "system",
          message: "Couldn't reach the team — please email hello@boreal.financial.",
        },
      ]);
    }
  }

  function reportIssue() {
    setMode("report");
  }

  async function submitIssue() {
    const text = issue.trim();
    if (!text) return;
    setIssue("");
    try {
      const { reportIssue: reportIssueFn } = await import("@/services/mayaService");
      await reportIssueFn({ sessionId, message: text });
      setMessages((prev) => [
        ...prev,
        { id: createSessionId(), from: "system", message: "✓ Thanks — your issue was logged." },
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
        <div className="chat-panel fixed inset-0 z-[70] flex h-[100dvh] w-full flex-col overflow-hidden border border-white/20 bg-[#08132a] shadow-2xl md:inset-auto md:bottom-20 md:right-4 md:h-[min(75vh,620px)] md:w-[min(90vw,420px)] md:rounded-2xl">
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
                className={`rounded-lg px-3 py-2 ${item.from === "user" ? "ml-8 bg-blue-600 text-white" : "mr-8 bg-[#0f1d3a] text-slate-100"}`}
              >
                {item.message}
              </div>
            ))}
            {sending ? <p className="text-xs text-slate-400">Maya is typing…</p> : null}
          </div>

          {mode === "report" ? (
            <div className="flex flex-col gap-2 border-t border-white/10 px-3 py-2 md:px-4">
              <textarea
                className="w-full rounded border border-white/20 bg-[#0f1d3a] p-2 text-sm text-white"
                rows={3}
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Describe the issue…"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("chat")}
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
              <div className="flex gap-2 border-t border-white/10 px-3 py-2 md:px-4">
                <button
                  type="button"
                  onClick={requestHumanSupport}
                  className="flex-1 rounded border border-white/20 px-3 py-2 text-sm"
                >
                  Talk to a Human
                </button>
                <button
                  type="button"
                  onClick={reportIssue}
                  className="flex-1 rounded border border-white/20 px-3 py-2 text-sm"
                >
                  Report an Issue
                </button>
              </div>
              <form onSubmit={handleSend} className="flex gap-2 border-t border-white/10 px-3 py-2 md:px-4">
                <input
                  className="flex-1 rounded border border-white/20 bg-[#0f1d3a] px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  placeholder={isOnline === false ? "Maya is offline — your message will be saved" : "Type a message…"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="rounded bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50"
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
        className="fixed bottom-4 right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
      >
        <MessageCircle size={20} />
      </button>
    </>
  );

  if (typeof document === "undefined") return null;
  return createPortal(chatUi, document.body);
}
