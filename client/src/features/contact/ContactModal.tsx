import { useState, type FormEvent } from "react";
import { redirectToClientApply } from "@/utils/handoff";

export default function ContactModal() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const businessName = String(form.get("businessName") ?? "").trim();

    setSubmitting(true);
    setErrorMessage(null);

    try {
      redirectToClientApply({
        businessName,
        email,
        phone,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("[FORM ERROR]", err);
      setErrorMessage("Unable to continue right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) return <div>Redirecting you to the client application...</div>;

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-4">
      <input className="w-full rounded border p-2" name="businessName" placeholder="Company Name" required />
      <input className="w-full rounded border p-2" name="name" placeholder="Full Name" required />
      <input className="w-full rounded border p-2" name="email" type="email" placeholder="Email" required />
      <input className="w-full rounded border p-2" name="phone" type="tel" placeholder="Mobile Phone" required />
      <button className="rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-70" disabled={submitting} type="submit">
        {submitting ? "Continuing..." : "Continue"}
      </button>
      {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
    </form>
  );
}
