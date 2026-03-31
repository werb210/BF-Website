import { FormEvent, useState } from "react";
import { trackEvent } from "@/utils/analytics";
import { redirectToClientApply } from "@/utils/handoff";

type ContactFormData = {
  companyName: string;
  name: string;
  email: string;
  mobilePhone: string;
  message: string;
  website: string;
};

const initialForm: ContactFormData = {
  companyName: "",
  name: "",
  email: "",
  mobilePhone: "",
  message: "",
  website: "",
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    setError(null);

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(formData.email.trim())) {
      setError("Email must be valid");
      return;
    }

    if (!formData.message.trim()) {
      setError("Message is required");
      return;
    }

    if (formData.website.trim()) {
      return;
    }

    setSubmitting(true);

    const businessName = formData.companyName.trim();
    const email = formData.email.trim();
    const phone = formData.mobilePhone.trim();

    try {
      trackEvent("contact_form_submitted", {
        source: "contact_page",
        company: formData.companyName,
      });

      await redirectToClientApply({
        businessName,
        email,
        phone,
        productType: "general",
      });

      setFormData(initialForm);
    } catch (err) {
      console.error("[FORM ERROR]", err);
      setError("Unable to continue right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border border-white/20 bg-[#0a1731] p-6 shadow-sm">
      <input className="w-full rounded-lg border border-white/20 bg-[#050B1A] px-3 py-3" placeholder="Company Name" required value={formData.companyName} onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))} />
      <input className="w-full rounded-lg border border-white/20 bg-[#050B1A] px-3 py-3" name="name" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
      <input className="w-full rounded-lg border border-white/20 bg-[#050B1A] px-3 py-3" name="email" type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
      <input className="w-full rounded-lg border border-white/20 bg-[#050B1A] px-3 py-3" type="tel" placeholder="Mobile Phone" required value={formData.mobilePhone} onChange={(e) => setFormData((prev) => ({ ...prev, mobilePhone: e.target.value }))} />
      <textarea className="min-h-[120px] w-full rounded-lg border border-white/20 bg-[#050B1A] px-3 py-3" name="message" placeholder="How can we help?" required value={formData.message} onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))} />
      <input
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        name="website"
        value={formData.website}
        onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
      />
      <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-70">{submitting ? "Continuing..." : "Continue"}</button>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </form>
  );
}
