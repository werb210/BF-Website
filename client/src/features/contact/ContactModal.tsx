import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";

export default function ContactModal() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const businessName = String(form.get("businessName") ?? "").trim();

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await api.post("/api/crm/createLead", {
        name,
        email,
        phone,
        businessName,
      });

      window.localStorage.setItem("prefill_data", JSON.stringify({ name, email, phone, businessName }));
      setSubmitted(true);
    } catch {
      setErrorMessage("Unable to submit right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) return <div>Thank you. We’ll contact you shortly.</div>;

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-4">
      <input className="w-full rounded border p-2" name="businessName" placeholder="Company Name" required />
      <input className="w-full rounded border p-2" name="name" placeholder="Full Name" required />
      <input className="w-full rounded border p-2" name="email" type="email" placeholder="Email" required />
      <input className="w-full rounded border p-2" name="phone" type="tel" placeholder="Mobile Phone" required />
      <button className="rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-70" disabled={submitting} type="submit">
        {submitting ? "Submitting..." : "Submit"}
      </button>
      {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
    </form>
  );
}
