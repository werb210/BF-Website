import { useState } from "react";
import { trackEvent } from "@/utils/analytics";
import { API_BASE_URL } from "@/config/env";

type ScoreModalProps = {
  open: boolean;
  onClose: () => void;
};

type ScoreForm = {
  revenue: string;
  years: string;
  industry: string;
  amount: string;
  email: string;
  phone: string;
};

const initialState: ScoreForm = {
  revenue: "",
  years: "",
  industry: "",
  amount: "",
  email: "",
  phone: "",
};

export default function ScoreModal({ open, onClose }: ScoreModalProps) {
  const [state, setState] = useState<ScoreForm>(initialState);
  const [result, setResult] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!state.email || !state.phone) {
      alert("Email & phone required");
      return;
    }

    try {
      setSubmitting(true);
      const utm = {
        utm_source: localStorage.getItem("utm_source"),
        utm_medium: localStorage.getItem("utm_medium"),
        utm_campaign: localStorage.getItem("utm_campaign"),
      };

      const response = await fetch(`${API_BASE_URL}/api/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...state, utm }),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error ?? "Unable to score");
      }

      setResult(body.score ?? null);
      trackEvent("capital_score_submit", { score: body.score ?? null, ...utm });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }
      alert("Unable to submit right now.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Capital Readiness Score</h2>
        {(Object.keys(state) as Array<keyof ScoreForm>).map((key) => (
          <input
            key={key}
            placeholder={key}
            className="mb-3 w-full rounded border p-2"
            value={state[key]}
            onChange={(e) => setState({ ...state, [key]: e.target.value })}
          />
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <button className="rounded border border-gray-300 px-4 py-2" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="rounded bg-green-600 px-4 py-2 text-white" onClick={submit} disabled={submitting}>
            {submitting ? "Scoring..." : "Score Me"}
          </button>
        </div>

        {result !== null && <p className="mt-4 text-sm font-semibold">Your Score: {result}/100</p>}
      </div>
    </div>
  );
}
