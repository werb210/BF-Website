import { FormEvent, useState } from "react";
import { submitLead } from "@/api/lead";

export default function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setStatus(null);
    setError(null);

    const result = await submitLead(form);

    if (!result.success) {
      setError(result.message || "Unable to submit lead right now.");
      setSubmitting(false);
      return;
    }

    setStatus("Lead submitted successfully.");

    const query = new URLSearchParams(form).toString();
    window.location.href = `https://client.boreal.financial/apply?${query}`;
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

      <button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Apply Now"}</button>
      {status ? <p>{status}</p> : null}
      {error ? <p>{error}</p> : null}
    </form>
  );
}
