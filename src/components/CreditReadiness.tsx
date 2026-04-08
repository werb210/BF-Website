import { FormEvent, useState } from "react";
import { useLocation } from "wouter";

type ReadinessForm = {
  companyName: string;
  fullName: string;
  email: string;
  phone: string;
  industry: string;
  yearsInBusiness: string;
  annualRevenue: string;
  monthlyRevenue: string;
  accountsReceivable: string;
  availableCollateral: string;
};

const initialForm: ReadinessForm = {
  companyName: "",
  fullName: "",
  email: "",
  phone: "",
  industry: "",
  yearsInBusiness: "",
  annualRevenue: "",
  monthlyRevenue: "",
  accountsReceivable: "",
  availableCollateral: "",
};

export default function CreditReadiness() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<ReadinessForm>(initialForm);

  function update<K extends keyof ReadinessForm>(key: K, value: ReadinessForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/credit-results");
  }

  return (
    <section className="py-12">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-[#08132a] p-6 md:grid-cols-2">
        <input
          required
          value={form.companyName}
          placeholder="Company Name"
          onChange={(e) => update("companyName", e.target.value)}
          className="w-full rounded border border-slate-700 bg-[#0b213f] p-3 text-white"
        />

        <input
          required
          value={form.fullName}
          placeholder="Full Name"
          onChange={(e) => update("fullName", e.target.value)}
          className="w-full rounded border border-slate-700 bg-[#0b213f] p-3 text-white"
        />

        <input
          required
          type="email"
          value={form.email}
          placeholder="Email"
          onChange={(e) => update("email", e.target.value)}
          className="w-full rounded border border-slate-700 bg-[#0b213f] p-3 text-white"
        />

        <input
          required
          type="tel"
          value={form.phone}
          placeholder="Phone"
          onChange={(e) => update("phone", e.target.value)}
          className="w-full rounded border border-slate-700 bg-[#0b213f] p-3 text-white"
        />

        <div className="my-4 border-t border-gray-600 md:col-span-2" />

        <select required value={form.industry} onChange={(e) => update("industry", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3 text-white">
          <option value="">Industry</option>
          <option>Construction</option>
          <option>Manufacturing</option>
          <option>Retail</option>
          <option>Technology</option>
          <option>Healthcare</option>
          <option>Transportation</option>
        </select>

        <select required value={form.yearsInBusiness} onChange={(e)=>update("yearsInBusiness",e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3 text-white">
          <option value="">Years in business</option>
          <option>Zero</option>
          <option>Under 1 Year</option>
          <option>1 to 3 Years</option>
          <option>Over 3 Years</option>
        </select>

        <select required value={form.annualRevenue} onChange={(e)=>update("annualRevenue",e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3 text-white">
          <option value="">Annual Revenue</option>
          <option>Zero to $150,000</option>
          <option>$150,001 to $500,000</option>
          <option>$500,001 to $1,000,000</option>
          <option>$1,000,001 to $3,000,000</option>
          <option>Over $3,000,000</option>
        </select>

        <select required value={form.monthlyRevenue} onChange={(e)=>update("monthlyRevenue",e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3 text-white">
          <option value="">Monthly Revenue</option>
          <option>Under $10,000</option>
          <option>$10,001 to $30,000</option>
          <option>$30,001 to $100,000</option>
          <option>Over $100,000</option>
        </select>

        <select required value={form.accountsReceivable} onChange={(e)=>update("accountsReceivable",e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3 text-white">
          <option value="">Accounts Receivable</option>
          <option>No Account Receivables</option>
          <option>Zero to $100,000</option>
          <option>$100,000 to $250,000</option>
          <option>$250,000 to $500,000</option>
          <option>$500,000 to $1,000,000</option>
          <option>$1,000,000 to $3,000,000</option>
          <option>Over $3,000,000</option>
        </select>

        <select required value={form.availableCollateral} onChange={(e)=>update("availableCollateral",e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3 text-white">
          <option value="">Available Collateral</option>
          <option>No Collateral Available</option>
          <option>$1 to $100,000</option>
          <option>$100,001 to $250,000</option>
          <option>$250,001 to $500,000</option>
          <option>$500,001 to $1 million</option>
          <option>Over $1 million</option>
        </select>

        <div className="md:col-span-2">
          <button type="submit" className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-700">
            Check Readiness
          </button>
        </div>
      </form>
    </section>
  );
}
