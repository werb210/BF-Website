import { useState } from "react";
import { trackEvent } from "@/utils/analytics";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

type ContactForm = {
  companyName: string;
  fullName: string;
  email: string;
  mobilePhone: string;
};

const initialForm: ContactForm = {
  companyName: "",
  fullName: "",
  email: "",
  mobilePhone: "",
};

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [form, setForm] = useState<ContactForm>(initialForm);

  const submit = () => {
    if (!form.companyName || !form.fullName || !form.email || !form.mobilePhone) {
      alert("All fields required");
      return;
    }

    trackEvent("contact_submit", { category: "conversion" });
    alert("Submitted");
    setForm(initialForm);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <input className="w-full rounded border p-2" placeholder="Company Name" required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          <input className="w-full rounded border p-2" placeholder="Full Name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input className="w-full rounded border p-2" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded border p-2" type="tel" placeholder="Mobile Phone" required value={form.mobilePhone} onChange={(e) => setForm({ ...form, mobilePhone: e.target.value })} />
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <button onClick={onClose} type="button" className="w-full rounded border border-gray-300 px-4 py-2">Cancel</button>
            <button type="submit" className="w-full rounded bg-slate-900 px-4 py-2 text-white">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
