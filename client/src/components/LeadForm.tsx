import { FormEvent, useState } from "react";
import { submitLead } from "@/utils/submitLead";
import { withLoading } from "@/lib/retry";

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

    setStatus(null);
    setError(null);

    try {
      await withLoading(setSubmitting, async () => {
        await submitLead({
          ...form,
          name: form.name,
        });
      });
      setStatus("Lead submitted successfully.");

      const query = new URLSearchParams(form).toString();
      window.location.href = `https://client.boreal.financial/apply?${query}`;
    } catch (err) {
      console.error("WEBSITE ERROR:", err);
      const message = err instanceof Error ? err.message : "Unable to submit lead right now.";
      alert(message);
      setError(message);
    }

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
