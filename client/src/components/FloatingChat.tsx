import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X } from "lucide-react";
import { getReadinessSessionToken } from "@/utils/session";
import { buildMayaWebSocketUrl, checkMayaHealth, isMayaConfigured } from "@/lib/mayaClient";

type ChatMessage = {
  id: string;
  message: string;
  from: "system" | "user";
};

const MAX_RECONNECT_ATTEMPTS = 5;

function createSessionId() {
  return `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chat" | "report">("chat");
  const [issue, setIssue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [healthChecked, setHealthChecked] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const intentionallyClosingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const healthAbortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [staffEscalated, setStaffEscalated] = useState(false);
  const staffEscalatedRef = useRef(false);
  const sessionId = useMemo(() => getReadinessSessionToken() ?? createSessionId(), []);

  useEffect(() => {
    setMessages([
      {
        id: "welcome-message",
        from: "system",
        message: "Hi — I’m Maya. How can I help you today?",
      },
    ]);
  }, []);

  useEffect(() => {
    staffEscalatedRef.current = staffEscalated;
  }, [staffEscalated]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!open || healthChecked) {
      return;
    }

    if (!isMayaConfigured()) {
      setIsOnline(false);
      setHealthChecked(true);
      return;
    }

    const controller = new AbortController();
    healthAbortRef.current = controller;

    void checkMayaHealth(controller.signal)
      .then((healthy) => {
        setIsOnline(healthy);
      })
      .finally(() => {
        setHealthChecked(true);
      });

    return () => {
      controller.abort();
      healthAbortRef.current = null;
    };
  }, [open, healthChecked]);

  useEffect(() => {
    if (!open || isOnline !== true || wsRef.current || reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      return;
    }

    const wsUrl = buildMayaWebSocketUrl("/ws/chat");
    if (!wsUrl) {
      setIsOnline(false);
      return;
    }

    intentionallyClosingRef.current = false;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    setConnecting(true);

    ws.onopen = () => {
      setConnecting(false);
      setConnected(true);
      reconnectAttemptsRef.current = 0;
      ws.send(JSON.stringify({ type: "join", sessionId }));
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { type?: string; message?: string };
        if (payload.type === "staff_joined") {
          setStaffEscalated(true);
          setMessages((prev) => [
            ...prev,
            {
              id: `${Date.now()}-staff`,
              from: "system",
              message: payload.message || "Transferring you to a specialist…",
            },
          ]);
          return;
        }
        if (staffEscalatedRef.current) return;
        const systemMessage = payload.message;
        if (systemMessage) {
          setMessages((prev) => [...prev, { id: `${Date.now()}-system`, from: "system", message: systemMessage }]);
        }
      } catch {
        setMessages((prev) => [...prev, { id: `${Date.now()}-fallback`, from: "system", message: "Message received." }]);
      }
    };

    ws.onerror = () => {
      setConnecting(false);
      setConnected(false);
      setIsOnline(false);
    };

    ws.onclose = () => {
      setConnecting(false);
      setConnected(false);
      wsRef.current = null;

      if (intentionallyClosingRef.current || !open || isOnline !== true) {
        intentionallyClosingRef.current = false;
        return;
      }

      reconnectAttemptsRef.current += 1;
      if (reconnectAttemptsRef.current > MAX_RECONNECT_ATTEMPTS) {
        setIsOnline(false);
        return;
      }

      const delayMs = Math.min(1000 * 2 ** (reconnectAttemptsRef.current - 1), 10000);
      reconnectTimerRef.current = setTimeout(() => {
        if (open && wsRef.current == null) {
          setHealthChecked(false);
        }
      }, delayMs);
    };

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      intentionallyClosingRef.current = true;
      ws.close();
      wsRef.current = null;
    };
  }, [open, isOnline, sessionId]);

  // BF_WEBSITE_BLOCK_v9_MAYA_INPUT_ENABLED_v1
  // Send strategy:
  //   - If WebSocket is OPEN, use it (real-time path).
  //   - If WebSocket is unavailable but the user has typed a message,
  //     POST to /api/website/contact as an asynchronous fallback so
  //     the message actually reaches a human. Acknowledge inline.
  //   - Never silently drop the user's input.
  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const wsOpen =
      wsRef.current && wsRef.current.readyState === WebSocket.OPEN && isOnline === true;

    if (mode === "report") {
      const issueText = issue.trim();
      if (!issueText) return;
      const payload = `Issue report: ${issueText}`;
      setMessages((prev) => [...prev, { id: `${Date.now()}-report`, from: "user", message: payload }]);
      setIssue("");
      setMode("chat");
      if (wsOpen) {
        wsRef.current!.send(JSON.stringify({ type: "message", sessionId, message: payload }));
      } else {
        await sendOfflineFallback(payload);
      }
      return;
    }

    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: `${Date.now()}-user`, from: "user", message: trimmed }]);
    setInput("");
    if (wsOpen) {
      wsRef.current!.send(JSON.stringify({ type: "message", sessionId, message: trimmed }));
    } else {
      await sendOfflineFallback(trimmed);
    }
  }

  async function sendOfflineFallback(message: string) {
    try {
      await fetch("/api/website/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "maya_offline", sessionId, message }),
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-system`,
          from: "system",
          message:
            "Maya is offline right now. Your message was queued and a specialist will follow up by email.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-system`,
          from: "system",
          message:
            "Couldn't reach our servers. Please email hello@boreal.financial or try again shortly.",
        },
      ]);
    }
  }

  function reportIssue() {
    setMode("report");
  }

  // BF_WEBSITE_BLOCK_v9_MAYA_INPUT_ENABLED_v1
  async function requestHumanSupport() {
    setMode("chat");
    const wsOpen =
      wsRef.current && wsRef.current.readyState === WebSocket.OPEN && isOnline === true;
    if (wsOpen) {
      wsRef.current!.send(JSON.stringify({ type: "staff_joined", sessionId }));
      return;
    }
    await sendOfflineFallback("[user requested live human support]");
  }

  const chatUi = (
    <>
      {open ? (
        <div className="chat-panel fixed bottom-20 right-4 z-[70] flex h-[min(75vh,620px)] w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#08132a] shadow-2xl md:w-[min(90vw,420px)]">
          <div className="chat-header flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Maya</p>
              <p className="text-xs text-slate-300">
                {isOnline === false ? "Chat offline" : connected ? "Online" : connecting ? "Connecting..." : "Offline"}
              </p>
            </div>
            <button aria-label="Close chat" onClick={() => setOpen(false)} className="rounded p-1 hover:bg-white/10">
              <X size={16} />
            </button>
          </div>
          <div ref={scrollRef} className="chat-messages flex-1 space-y-2 overflow-y-auto p-4 text-sm">
            {isOnline === false ? <p className="text-amber-300">Chat offline. Please contact us directly.</p> : null}
            {connecting ? <p className="text-slate-300">Connecting…</p> : null}
            {messages.map((item) => (
              <div key={item.id} className={`rounded-lg px-3 py-2 ${item.from === "user" ? "ml-8 bg-blue-600 text-white" : "mr-8 bg-[#0f1d3a] text-slate-100"}`}>
                {item.message}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-white/10 px-3 py-2 md:px-4">
            {/* BF_WEBSITE_BLOCK_v9_MAYA_INPUT_ENABLED_v1 — always interactive.
               "Talk to a Human" prefers WS escalation but falls back to
               offline ack. "Report an Issue" only switches mode locally,
               which is always safe. */}
            <button type="button" onClick={requestHumanSupport} className="flex-1 rounded border border-white/20 px-3 py-2">
              Talk to a Human
            </button>
            <button type="button" onClick={reportIssue} className="flex-1 rounded border border-white/20 px-3 py-2">
              Report an Issue
            </button>
          </div>
          <form onSubmit={sendMessage} className="chat-input border-t border-white/10">
            <div className="flex gap-2 border-t border-gray-700 p-3">
              {/* BF_WEBSITE_BLOCK_v9_MAYA_INPUT_ENABLED_v1 — never disable
                 input/textarea/Send. If WS is offline, sendMessage falls
                 back to POST /api/website/contact so the user's typed
                 message still reaches a human. Frozen UI was the
                 reported failure mode. */}
              {mode === "report" ? (
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder={
                    isOnline === false
                      ? "Maya is offline — your message will be emailed to a specialist"
                      : "Describe the issue you encountered"
                  }
                  className="min-h-24 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                />
              ) : (
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isOnline === false
                      ? "Maya is offline — your message will be emailed to a specialist"
                      : "Type your message..."
                  }
                  className="flex-1 rounded-lg bg-gray-800 px-3 py-2 outline-none"
                />
              )}
              <button
                type="submit"
                className="self-end rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
                aria-label="Send chat message"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700"
        aria-label="Open support chat"
      >
        <MessageCircle size={22} />
      </button>
    </>
  );

  return createPortal(chatUi, document.body);
}
