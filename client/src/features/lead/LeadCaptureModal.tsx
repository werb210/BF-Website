import { useState, type FormEvent } from "react";
import { redirectToClientApply } from "@/utils/handoff";

export default function LeadCaptureModal({ onDone }: { onDone?: () => void }) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const businessName = String(form.get("businessName") ?? "").trim();

    setSuccessMessage(null);
    setErrorMessage(null);
    setSubmitting(true);

    try {
      redirectToClientApply({
        businessName,
        email,
        phone,
      });

      setSuccessMessage("Redirecting you to the application...");
      onDone?.();
    } catch (err) {
      console.error("[FORM ERROR]", err);
      setErrorMessage("Unable to continue right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-2xl font-semibold">Get Your Capital Strategy Call</h2>
      <input className="w-full rounded border p-2" name="name" placeholder="Name" required />
      <input className="w-full rounded border p-2" name="email" type="email" placeholder="Email" required />
      <input className="w-full rounded border p-2" name="phone" type="tel" placeholder="Phone" required />
      <input className="w-full rounded border p-2" name="businessName" placeholder="Business Name" required />
      <button className="rounded bg-orange-500 px-4 py-2 font-semibold text-white disabled:opacity-70" type="submit" disabled={submitting}>
        {submitting ? "Continuing..." : "Continue"}
      </button>
      {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}
      {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
    </form>
  );
}
