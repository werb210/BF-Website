import { FormEvent, useEffect, useState } from "react";
import { formatRateRange } from "@/core/rateFormatter";
import {
  escalateToFundingSpecialist,
  fetchFaq,
  joinStartupWaitlist,
  sendMessage,
  trackMarketingLead,
  type MayaWebsiteResponse,
} from "@/services/mayaService";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function StartupWaitlistForm() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    await joinStartupWaitlist({
      email,
      companyName,
    });

    setSubmitted(true);
    setEmail("");
    setCompanyName("");
  }

  if (submitted) {
    return <p className="text-xs text-green-700 mt-2">Thanks — you have been added to the startup waitlist.</p>;
  }

  return (
    <form className="mt-2 space-y-2" onSubmit={(event) => void handleSubmit(event)}>
      <input
        className="w-full border rounded p-2 text-xs"
        placeholder="Work email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        className="w-full border rounded p-2 text-xs"
        placeholder="Company name (optional)"
        value={companyName}
        onChange={(event) => setCompanyName(event.target.value)}
      />
      <button type="submit" className="w-full bg-slate-900 text-white rounded p-2 text-xs">
        Join Startup Waitlist
      </button>
    </form>
  );
}

export default function MayaWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<MayaWebsiteResponse | null>(null);
  const [faq, setFaq] = useState<Array<{ question: string; answer: string }>>([]);

  useEffect(() => {
    fetch("/health").catch(() => null);
    void trackMarketingLead();
    void fetchFaq().then((result) => setFaq(result.data.faqs)).catch(() => setFaq([]));
  }, []);

  async function handleSend() {
    if (!input.trim()) return;

    const userInput = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    const res = await sendMessage(userInput);
    setResponse(res.data);

    const assistantReply = res.data.min_rate !== undefined && res.data.max_rate !== undefined
      ? formatRateRange(res.data.min_rate, res.data.max_rate)
      : res.data.reply;

    setMessages((prev) => [...prev, { role: "assistant", content: assistantReply }]);
  }

  async function handleEscalation() {
    await escalateToFundingSpecialist();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "A funding specialist has been notified and will follow up shortly." },
    ]);
  }

  return (
    <div className="maya-widget bg-white shadow-xl rounded-xl border">
      <div className="p-3 font-bold border-b">Ask Maya</div>

      <div className="p-3 h-64 overflow-y-auto text-sm space-y-2">
        {messages.map((m, i) => (
          <div key={`${m.role}-${i}`} className={m.role === "assistant" ? "text-slate-700" : "text-slate-900"}>
            {m.content}
          </div>
        ))}

        {response?.startup_unavailable && <StartupWaitlistForm />}
      </div>

      <div className="flex border-t">
        <input
          className="flex-1 p-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="How can Maya help?"
        />
        <button onClick={() => void handleSend()} className="px-3">
          Send
        </button>
      </div>

      <div className="p-2 border-t space-y-2">
        <button onClick={() => void handleEscalation()} className="w-full text-xs p-2 border rounded">
          Speak With A Funding Specialist
        </button>

        <p className="text-xs text-gray-500 mt-2">
          Maya provides general information and qualification guidance only. Final approvals are subject to lender review.
        </p>

        {faq.length > 0 && <p className="text-[11px] text-slate-500">Dynamic FAQ loaded ({faq.length} items).</p>}
      </div>
    </div>
  );
}
