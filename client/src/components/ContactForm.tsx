import { FormEvent, useState } from "react";
import { safeFetch } from "@/lib/safeFetch";
import { trackEvent } from "@/utils/analytics";
import { WEBSITE_API_BASE } from "@/config/api";
import { formatPhone } from "@/utils/formatters";

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

function splitName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/);
  const firstName = parts.shift() ?? "";
  const lastName = parts.join(" ") || "N/A";
  return { firstName, lastName };
}

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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

    const { firstName, lastName } = splitName(formData.name);

    try {
      // BF_WEBSITE_BLOCK_v82_CONTACT_FIELDS_v1
      // BF-Server's submitContactForm reads companyName + fullName
      // (contact.controller.ts:11-17) and 400s when those are
      // undefined. Match its expected shape; send firstName +
      // lastName as well for any future consumer that wants them.
      const fullNameJoined = [firstName, lastName].filter(Boolean).join(" ").trim();
      await safeFetch(`${WEBSITE_API_BASE}/api/website/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          fullName: fullNameJoined,
          firstName,
          lastName,
          email: formData.email,
          phone: formData.mobilePhone,
          message: formData.message,
        }),
      });

      trackEvent("contact_form_submitted", {
        source: "contact_page",
        company: formData.companyName,
      });

      setShowSuccess(true);
      setFormData(initialForm);
    } catch {
      setError("Unable to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border border-white/20 bg-[#0a1731] p-6 shadow-sm">
        <input className="w-full rounded-lg border border-white/20 bg-[#050B1A] px-3 py-3" placeholder="Company Name" required value={formData.companyName} onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))} />
        <input className="w-full rounded-lg border border-white/20 bg-[#050B1A] px-3 py-3" name="name" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
        <input className="w-full rounded-lg border border-white/20 bg-[#050B1A] px-3 py-3" name="email" type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
        <input className="w-full rounded-lg border border-white/20 bg-[#050B1A] px-3 py-3" type="tel" inputMode="tel" placeholder="Mobile Phone" required value={formData.mobilePhone} onChange={(e) => setFormData((prev) => ({ ...prev, mobilePhone: formatPhone(e.target.value) }))} />
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
        <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-70">{submitting ? "Submitting..." : "Submit"}</button>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
      </form>

      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-[#0a1731] p-6 text-center">
            <p className="text-lg font-semibold">A Boreal Intake Specialist will contact you shortly</p>
            <button onClick={() => { setShowSuccess(false); window.location.href = "/"; }} className="mt-5 rounded-full bg-white px-5 py-2.5 font-semibold text-black">Continue</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
