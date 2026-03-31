import { useState } from "react";
import { trackEvent } from "@/utils/analytics";
import { redirectToClientApply } from "@/utils/handoff";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

type ContactForm = {
  businessName: string;
  name: string;
  email: string;
  phone: string;
};

const initialForm: ContactForm = {
  businessName: "",
  name: "",
  email: "",
  phone: "",
};

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!form.businessName || !form.name || !form.email || !form.phone) {
      setErrorMessage("All fields are required.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      trackEvent("contact_submit", { category: "conversion" });
      await redirectToClientApply({
        businessName: form.businessName,
        email: form.email,
        phone: form.phone,
      });
      setForm(initialForm);
      onClose();
    } catch (err) {
      console.error("[FORM ERROR]", err);
      setErrorMessage("Unable to continue right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void submit(); }}>
          <input className="w-full rounded border p-2" placeholder="Company Name" required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
          <input className="w-full rounded border p-2" placeholder="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full rounded border p-2" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded border p-2" type="tel" placeholder="Mobile Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <button onClick={onClose} type="button" className="w-full rounded border border-gray-300 px-4 py-2">Cancel</button>
            <button type="submit" disabled={submitting} className="w-full rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-70">{submitting ? "Continuing..." : "Continue"}</button>
          </div>
          {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
        </form>
      </div>
    </div>
  );
}
