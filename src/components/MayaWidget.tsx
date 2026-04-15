import { useState } from "react";
import { sendMayaMessage } from "@/api/maya";

type MayaMessage = {
  role: "user" | "maya";
  text: string;
};

const QUICK_ACTIONS = [
  { label: "🚀 Start Application", href: "https://client.boreal.financial/otp" },
  { label: "📁 Upload Documents", href: "https://client.boreal.financial/otp" },
  { label: "📅 Book Meeting", action: "book_meeting" },
  { label: "👤 Talk to Human", action: "talk_human" },
  { label: "⚠️ Report Issue", action: "report_issue" },
] as const;

const OPENING_MESSAGE = "Hi — I'm Maya. I can help with your application, documents, and support.";

export default function MayaWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MayaMessage[]>([{ role: "maya", text: OPENING_MESSAGE }]);
  const [isSending, setIsSending] = useState(false);

  async function sendMessage(messageText: string) {
    const trimmedInput = messageText.trim();
    if (!trimmedInput || isSending) return;

    setInput("");
    setIsSending(true);
    setMessages((prev) => [...prev, { role: "user", text: trimmedInput }]);

    try {
      const result = await sendMayaMessage(trimmedInput);
      const reply = result.reply || "Thanks — Maya received your message.";
      setMessages((prev) => [...prev, { role: "maya", text: reply }]);
    } catch (err) {
      console.error("WEBSITE ERROR:", err);
      const message =
        err instanceof Error ? err.message : "Maya is unavailable right now. Please try again.";
      alert(message);
      setMessages((prev) => [...prev, { role: "maya", text: message }]);
    } finally {
      setIsSending(false);
    }
  }

  function handleQuickAction(action: (typeof QUICK_ACTIONS)[number]) {
    if ("href" in action) {
      window.open(action.href, "_blank", "noopener,noreferrer");
      return;
    }

    void sendMessage(action.action.replaceAll("_", " "));
  }

  const showQuickActions = messages.length === 1 && messages[0]?.role === "maya";

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      {!open && <button onClick={() => setOpen(true)}>Chat with Maya</button>}

      {open && (
        <div style={{ width: 320, height: 420, border: "1px solid #ccc", background: "#fff", borderRadius: 8 }}>
          <div style={{ height: 320, overflow: "auto", padding: 8 }}>
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`}>
                <b>{m.role}:</b> {m.text}
              </div>
            ))}

            {showQuickActions && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action)}
                    style={{ border: "1px solid #e5e7eb", borderRadius: 999, padding: "6px 10px", fontSize: 12 }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, padding: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Maya..."
              style={{ flex: 1 }}
            />
            <button onClick={() => void sendMessage(input)} disabled={isSending}>
              {isSending ? "..." : "Send"}
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px 8px" }}>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
