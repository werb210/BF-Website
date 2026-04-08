import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X } from "lucide-react";
import { getReadinessSessionToken } from "@/utils/session";
import { buildMayaWebSocketUrl, checkMayaHealth, isMayaConfigured } from "@/api/maya";

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
      } catch (error) {
        console.error("MAYA_ERROR:", error);
        setMessages((prev) => [...prev, { id: `${Date.now()}-system`, from: "system", message: "Message received." }]);
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

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isOnline !== true || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    if (mode === "report") {
      const issueText = issue.trim();
      if (!issueText) return;
      wsRef.current.send(JSON.stringify({ type: "message", sessionId, message: `Issue report: ${issueText}` }));
      setMessages((prev) => [...prev, { id: `${Date.now()}-report`, from: "user", message: `Issue report: ${issueText}` }]);
      setIssue("");
      setMode("chat");
      return;
    }

    const trimmed = input.trim();
    if (!trimmed) return;
    wsRef.current.send(JSON.stringify({ type: "message", sessionId, message: trimmed }));
    setMessages((prev) => [...prev, { id: `${Date.now()}-user`, from: "user", message: trimmed }]);
    setInput("");
  }

  function reportIssue() {
    setMode("report");
  }

  function requestHumanSupport() {
    setMode("chat");
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "staff_joined", sessionId }));
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
            <button type="button" onClick={requestHumanSupport} className="flex-1 rounded border border-white/20 px-3 py-2" disabled={isOnline !== true}>
              Talk to a Human
            </button>
            <button type="button" onClick={reportIssue} className="flex-1 rounded border border-white/20 px-3 py-2" disabled={isOnline !== true}>
              Report an Issue
            </button>
          </div>
          <form onSubmit={sendMessage} className="chat-input border-t border-white/10">
            <div className="flex gap-2 border-t border-gray-700 p-3">
              {mode === "report" ? (
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder={isOnline === false ? "Chat offline" : "Describe the issue you encountered"}
                  className="min-h-24 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
                  disabled={isOnline !== true}
                />
              ) : (
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isOnline === false ? "Chat offline" : "Type your message..."}
                  className="flex-1 rounded-lg bg-gray-800 px-3 py-2 outline-none"
                  disabled={isOnline !== true}
                />
              )}
              <button type="submit" className="self-end rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50" aria-label="Send chat message" disabled={isOnline !== true}>
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
