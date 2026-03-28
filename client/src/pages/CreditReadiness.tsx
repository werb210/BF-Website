import { FormEvent, useEffect, useState } from "react";
import { estimateCommissionValue, trackConversion, trackEvent, trackLeadProfile } from "@/main";
import { useLocation } from "wouter";
import { apiUrl } from "@/config/api";

type ReadinessForm = {
  organization: string;
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

const industryOptions = [
  "Construction",
  "Manufacturing",
  "Retail",
  "Restaurant / Food Service",
  "Technology",
  "Healthcare",
  "Transportation",
  "Professional Services",
  "Agriculture",
  "Energy",
  "Distribution",
  "Media",
];

const initialForm: ReadinessForm = {
  organization: "",
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

const CREDIT_RESULT_STORAGE_KEY = "boreal_credit_readiness_result";

export default function CreditReadiness() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<ReadinessForm>(initialForm);

  useEffect(() => {
    trackEvent("funnel_stage", {
      stage: "credit_readiness_start",
    });
  }, []);

  function update<K extends keyof ReadinessForm>(key: K, value: ReadinessForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch(apiUrl("/api/public/readiness"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: form.organization,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        industry: form.industry,
        yearsInBusiness: form.yearsInBusiness,
        annualRevenue: form.annualRevenue,
        monthlyRevenue: form.monthlyRevenue,
        arBalance: form.accountsReceivable,
        collateral: form.availableCollateral,
      }),
    });

    if (!response.ok) {
      return;
    }

    trackEvent("funnel_stage", {
      stage: "credit_readiness_completed",
    });

    const estimatedValue = estimateCommissionValue(form.annualRevenue);

    trackConversion("qualified_lead", {
      source: "website",
      estimated_commission_value: estimatedValue,
      capital_range: form.annualRevenue,
    });

    const body = await response.json() as { score?: number; tier?: "green" | "yellow" | "red" };
    if (typeof body.score === "number" && body.tier) {
      sessionStorage.setItem(CREDIT_RESULT_STORAGE_KEY, JSON.stringify({ score: body.score, tier: body.tier, capitalRange: form.annualRevenue }));
    }

    const calculatedStrength: "strong" | "moderate" | "weak" = body.tier === "green" ? "strong" : body.tier === "yellow" ? "moderate" : "weak";
    trackLeadProfile({
      strength: calculatedStrength,
      industry: form.industry,
      capital_range: form.annualRevenue,
      collateral_type: form.availableCollateral,
    });

    navigate("/credit-results");
  }

  return (
    <main className="bg-[#020817] px-5 py-10 text-white md:px-6 md:py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-3 text-3xl font-bold md:text-5xl">Credit Readiness</h1>
        <p className="text-xl font-semibold md:text-2xl">Tell us about your business</p>

        <form autoComplete="on" onSubmit={handleSubmit} className="mt-10 rounded-2xl border border-white/10 bg-[#08132a] p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <input required id="organization" name="organization" type="text" autoComplete="organization" value={form.organization} placeholder="Company Name" onChange={(e) => update("organization", e.target.value.replace(/\b\w/g, (l) => l.toUpperCase()))} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3" />
            <input required id="fullName" name="fullName" type="text" autoComplete="name" value={form.fullName} placeholder="Full Name" onChange={(e) => update("fullName", e.target.value.replace(/\b\w/g, (l) => l.toUpperCase()))} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3" />
            <input required id="email" name="email" type="email" autoComplete="email" inputMode="email" value={form.email} placeholder="Email" onChange={(e) => update("email", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3" />
            <input required id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} placeholder="Phone" onChange={(e) => { const numbers = e.target.value.replace(/\D/g, "").slice(0, 10); const formatted = numbers.length <= 3 ? numbers : numbers.length <= 6 ? `(${numbers.slice(0, 3)}) ${numbers.slice(3)}` : `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`; update("phone", formatted); }} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3" />

            <select required id="industry" name="industry" value={form.industry} onChange={(e) => update("industry", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Industry</option>
              {industryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>

            <select required id="yearsInBusiness" name="yearsInBusiness" value={form.yearsInBusiness} onChange={(e) => update("yearsInBusiness", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Years in business</option>
              <option>Zero</option><option>Under 1 Year</option><option>1 to 3 Years</option><option>Over 3 Years</option>
            </select>

            <select required id="annualRevenue" name="annualRevenue" value={form.annualRevenue} onChange={(e) => update("annualRevenue", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Annual Revenue</option>
              <option>Zero to $150,000</option><option>$150,001 to $500,000</option><option>$500,001 to $1,000,000</option><option>$1,000,001 to $3,000,000</option><option>Over $3,000,000</option>
            </select>

            <select required id="monthlyRevenue" name="monthlyRevenue" value={form.monthlyRevenue} onChange={(e) => update("monthlyRevenue", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Monthly Revenue</option>
              <option>Under $10,000</option><option>$10,001 to $30,000</option><option>$30,001 to $100,000</option><option>Over $100,000</option>
            </select>

            <select required id="accountsReceivable" name="accountsReceivable" value={form.accountsReceivable} onChange={(e) => update("accountsReceivable", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Accounts Receivable</option>
              <option>No Account Receivables</option><option>Zero to $100,000</option><option>$100,000 to $250,000</option><option>$250,000 to $500,000</option><option>$500,000 to $1,000,000</option><option>$1,000,000 to $3,000,000</option><option>Over $3,000,000</option>
            </select>

            <select required id="availableCollateral" name="availableCollateral" value={form.availableCollateral} onChange={(e) => update("availableCollateral", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Available Collateral</option>
              <option>No Collateral Available</option><option>$1 to $100,000</option><option>$100,001 to $250,000</option><option>$250,001 to $500,000</option><option>$500,001 to $1 million</option><option>Over $1 million</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            Check Readiness
          </button>
        </form>
      </div>
    </main>
  );
}
