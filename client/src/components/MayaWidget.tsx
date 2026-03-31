import { useState } from "react";
import { sendMayaMessage } from "@/api/maya";

type MayaMessage = {
  role: "user" | "maya";
  text: string;
};

export default function MayaWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MayaMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  async function send() {
    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    setInput("");
    setIsSending(true);
    setMessages((prev) => [...prev, { role: "user", text: trimmedInput }]);

    const result = await sendMayaMessage(trimmedInput);

    if (!result.success) {
      setMessages((prev) => [
        ...prev,
        { role: "maya", text: result.message || "Maya is unavailable right now. Please try again." },
      ]);
      setIsSending(false);
      return;
    }

    const reply = result.data?.reply || result.data?.data?.reply || "Thanks — Maya received your message.";
    setMessages((prev) => [...prev, { role: "maya", text: reply }]);
    setIsSending(false);
  }

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      {!open && <button onClick={() => setOpen(true)}>Chat with Maya</button>}

      {open && (
        <div style={{ width: 320, height: 420, border: "1px solid #ccc", background: "#fff", borderRadius: 8 }}>
          <div style={{ height: 320, overflow: "auto", padding: 8 }}>
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`}><b>{m.role}:</b> {m.text}</div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, padding: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Maya..."
              style={{ flex: 1 }}
            />
            <button onClick={() => void send()} disabled={isSending}>{isSending ? "..." : "Send"}</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px 8px" }}>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
