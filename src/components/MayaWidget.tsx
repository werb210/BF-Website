import { useState } from "react";
import { sendMayaMessage, isMayaEnabled } from "@/api/maya";

type Message = { role: "user" | "maya"; text: string };

const QUICK_ACTIONS = [
  { label: "🚀 Start Application", href: "https://client.boreal.financial" },
  { label: "📁 Upload Documents", href: "https://client.boreal.financial/otp" },
  { label: "📅 Book Meeting", action: "book_meeting" },
  { label: "👤 Talk to Human", action: "talk_human" },
  { label: "⚠️ Report Issue", action: "report_issue" },
] as const;

export default function MayaWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "maya",
      text: "👋 Hello! I'm your Boreal Financial assistant. I'm here to help you find the perfect funding solution for your business.",
    },
  ]);

  if (!isMayaEnabled()) return null;

  const showActions = messages.length === 1;

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setInput("");
    setSending(true);
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    try {
      const result = (await sendMayaMessage(trimmed)) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        { role: "maya", text: result.reply ?? "Thanks — Maya received your message." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "maya", text: "Maya is unavailable right now. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleAction(action: (typeof QUICK_ACTIONS)[number]) {
    if ("href" in action) {
      window.open(action.href, "_blank", "noopener,noreferrer");
      return;
    }
    void send(action.action.replaceAll("_", " "));
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#1e3a5f",
            color: "#fff",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          💬
        </button>
      )}
      {open && (
        <div
          style={{
            width: 340,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1e3a5f, #f59e0b)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Boreal Assistant</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>Powered by AI</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
          <div
            style={{
              flex: 1,
              maxHeight: 300,
              overflowY: "auto",
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: m.role === "user" ? "#1e3a5f" : "#f1f5f9",
                    color: m.role === "user" ? "#fff" : "#0f172a",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {showActions && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
                {QUICK_ACTIONS.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => handleAction(a)}
                    style={{
                      padding: "8px 6px",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      fontSize: 12,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void send(input)}
              placeholder="Ask me about financing..."
              style={{
                flex: 1,
                padding: "8px 10px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 13,
                outline: "none",
              }}
            />
            <button
              onClick={() => void send(input)}
              disabled={sending}
              style={{
                padding: "8px 14px",
                background: "#1e3a5f",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {sending ? "..." : "→"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
