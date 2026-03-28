import { useState } from "react";
import { trackEvent } from "@/utils/analytics";
import { api } from "@/lib/api";

type ScoreModalProps = {
  open: boolean;
  onClose: () => void;
};

type ScoreForm = {
  name: string;
  businessName: string;
  revenue: string;
  years: string;
  industry: string;
  amount: string;
  email: string;
  phone: string;
};

const initialState: ScoreForm = {
  name: "",
  businessName: "",
  revenue: "",
  years: "",
  industry: "",
  amount: "",
  email: "",
  phone: "",
};

export default function ScoreModal({ open, onClose }: ScoreModalProps) {
  const [state, setState] = useState<ScoreForm>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async () => {
    if (!state.name || !state.businessName || !state.email || !state.phone) {
      setErrorMessage("Name, business name, email, and phone are required.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const { name, email, phone, businessName } = state;

      await api.post("/api/crm/createLead", {
        name,
        email,
        phone,
        businessName,
      });

      window.localStorage.setItem("prefill_data", JSON.stringify({ name, email, phone, businessName }));

      trackEvent("capital_score_submit", {
        source: "score_modal",
      });

      setSuccessMessage("Thanks! Your information was submitted successfully.");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }
      setErrorMessage("Unable to submit right now.");
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

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <button className="rounded border border-gray-300 px-4 py-2" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="rounded bg-green-600 px-4 py-2 text-white" onClick={submit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        {successMessage ? <p className="mt-4 text-sm font-semibold text-emerald-700">{successMessage}</p> : null}
        {errorMessage ? <p className="mt-4 text-sm font-semibold text-red-700">{errorMessage}</p> : null}
      </div>
    </div>
  );
}
