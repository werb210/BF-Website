import { FormEvent, useState } from "react";
import { api } from "@/api/client";

export default function Contact() {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", help: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [err, setErr] = useState<string>("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErr("");

    try {
      // BF_WEBSITE_CONTACT_PATH_v53 — match BF-Server submitContactForm:
      // POST /api/website/contact with camelCase {companyName, fullName, ...}.
      await api("/api/website/contact", {
        method: "POST",
        body: JSON.stringify({
          companyName: form.company,
          fullName: form.name,
          email: form.email,
          phone: form.phone,
          message: form.help,
        }),
      });

      setStatus("ok");
      setForm({ company: "", name: "", email: "", phone: "", help: "" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Could not submit. Try again.";
      setStatus("err");
      setErr(message);
    }
  }

  return (
    <section className="container-bf py-16 text-white">
      <h1 className="mb-2 text-4xl font-semibold md:text-5xl">Contact Boreal</h1>
      <p className="mb-8 max-w-prose text-white/80">Tell us about your business and an advisor will follow up.</p>
      <form onSubmit={submit} className="grid max-w-2xl gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <Input label="Company Name" value={form.company} onChange={(v) => setForm((f) => ({ ...f, company: v }))} required />
        <Input label="Full Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
        <Input label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
        <Input label="Mobile Phone" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
        <label className="grid gap-1">
          <span className="text-sm text-white/80">How can we help?</span>
          <textarea
            value={form.help}
            onChange={(e) => setForm((f) => ({ ...f, help: e.target.value }))}
            rows={5}
            className="rounded-md border border-white/15 bg-white/5 p-3 text-white"
          />
        </label>
        <button disabled={status === "sending"} className="w-fit rounded-md bg-blue-500 px-6 py-3 text-white hover:bg-blue-600 disabled:opacity-70">
          {status === "sending" ? "Sending…" : "Continue →"}
        </button>
        {status === "ok" && <div className="text-emerald-400">We've saved your info and will follow up shortly.</div>}
        {status === "err" && <div className="text-rose-400">{err}</div>}
      </form>
    </section>
  );
}

function Input({ label, value, onChange, type = "text", required }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-sm text-white/80">{label}{required ? " *" : ""}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-white/15 bg-white/5 p-3 text-white"
      />
    </label>
  );
}
