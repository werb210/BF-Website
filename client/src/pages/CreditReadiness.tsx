import { FormEvent, useEffect, useState } from "react";
import { estimateCommissionValue, trackConversion, trackEvent, trackLeadProfile } from "@/main";
import { useLocation } from "wouter";

// BF_WEBSITE_BLOCK_1_13_V2 — V1 14-field form aligned with BF-client
// Step1_KYC.tsx canonical schema (see client-app/src/schemas/v1WizardSchema.ts).
// Bucket boundaries are exact matches — DO NOT change them without also
// updating the wizard, or phone-based prefill will mismatch on hydration.

type ReadinessForm = {
  // identity
  companyName: string;
  fullName: string;
  email: string;
  phone: string;
  // business profile
  industry: string;
  businessLocation: string;
  // funding profile
  fundingType: string;
  requestedAmount: string;
  purposeOfFunds: string;
  // financial profile
  salesHistoryYears: string;
  annualRevenueRange: string;
  avgMonthlyRevenueRange: string;
  accountsReceivableRange: string;
  fixedAssetsValueRange: string;
};

const initialForm: ReadinessForm = {
  companyName: "",
  fullName: "",
  email: "",
  phone: "",
  industry: "",
  businessLocation: "",
  fundingType: "",
  requestedAmount: "",
  purposeOfFunds: "",
  salesHistoryYears: "",
  annualRevenueRange: "",
  avgMonthlyRevenueRange: "",
  accountsReceivableRange: "",
  fixedAssetsValueRange: "",
};

const INDUSTRIES = [
  "Construction",
  "Manufacturing",
  "Retail",
  "Restaurant / Food Service",
  "Technology",
  "Healthcare",
  "Transportation",
  "Distribution",
  "Logistics",
  "Professional Services",
  "Agriculture",
  "Energy",
  "Media",
  "Other",
];
const LOCATIONS = ["Canada", "United States", "Other"];
const FUNDING_TYPES = [
  "Line of Credit",
  "Term Loan",
  "Equipment Financing",
  "Factoring",
  "Purchase Order Financing",
];
const PURPOSES = ["Working Capital", "Funds to cover A/R", "Buy Inventory", "Expansion"];
const SALES_HISTORY = ["Zero", "Under 1 Year", "1 to 3 Years", "Over 3 Years"];
const ANNUAL_REV = [
  "Zero to $150,000",
  "$150,001 to $500,000",
  "$500,001 to $1,000,000",
  "$1,000,001 to $3,000,000",
  "Over $3,000,000",
];
const MONTHLY_REV = [
  "$10,000 to $25,000",
  "$25,000 to $50,000",
  "$50,000 to $100,000",
  "$100,000 to $250,000",
  "Over $250,000",
];
const AR = [
  "No Account Receivables",
  "Zero to $100,000",
  "$100,000 to $250,000",
  "$250,000 to $500,000",
  "$500,000 to $1,000,000",
  "$1,000,000 to $3,000,000",
  "Over $3,000,000",
];
const FIXED_ASSETS = [
  "None",
  "$1 to $50,000",
  "$50,001 to $100,000",
  "$100,001 to $250,000",
  "$250,001 to $500,000",
  "Over $500,000",
];

const CREDIT_RESULT_STORAGE_KEY = "boreal_credit_readiness_result";

export default function CreditReadiness() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<ReadinessForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("funnel_stage", { stage: "credit_readiness_start" });
  }, []);

  function update<K extends keyof ReadinessForm>(key: K, value: ReadinessForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/website/credit-readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const body = (await response.json()) as {
        success?: boolean;
        leadId?: string;
        redirect?: string;
        score?: number;
        tier?: "green" | "yellow" | "red";
      };

      trackEvent("funnel_stage", { stage: "credit_readiness_completed" });

      const estimatedValue = estimateCommissionValue(form.annualRevenueRange);
      trackConversion("qualified_lead", {
        source: "website",
        estimated_commission_value: estimatedValue,
        capital_range: form.annualRevenueRange,
      });

      if (typeof body.score === "number" && body.tier) {
        sessionStorage.setItem(
          CREDIT_RESULT_STORAGE_KEY,
          JSON.stringify({
            score: body.score,
            tier: body.tier,
            capitalRange: form.annualRevenueRange,
          }),
        );
        const strength: "strong" | "moderate" | "weak" =
          body.tier === "green" ? "strong" : body.tier === "yellow" ? "moderate" : "weak";
        trackLeadProfile({
          strength,
          industry: form.industry,
          capital_range: form.annualRevenueRange,
          collateral_type: form.fixedAssetsValueRange,
        });
      }

      // The server returns redirect=https://client.boreal.financial/apply?continue=<token>
      // Phone-based prefill on the client side (Block 1.15) hydrates Step 1 KYC
      // when the user OTP-logs in with the same phone they entered here.
      if (body.redirect) {
        window.location.href = body.redirect;
        return;
      }
      navigate("/credit-results");
    } catch {
      setError("Unable to submit. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-[#020817] px-5 py-10 text-white md:px-6 md:py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-3 text-3xl font-bold md:text-5xl">Credit Readiness</h1>
        <p className="text-xl font-semibold md:text-2xl">Tell us about your business</p>

        <form
          autoComplete="on"
          onSubmit={handleSubmit}
          className="mt-10 rounded-2xl border border-white/10 bg-[#08132a] p-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <input required type="text" autoComplete="organization" placeholder="Company Name" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3" />
            <input required type="text" autoComplete="name" placeholder="Full Name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3" />
            <input required type="email" autoComplete="email" inputMode="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3" />
            <input required type="tel" autoComplete="tel" inputMode="tel" placeholder="Mobile Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3" />

            <select required value={form.industry} onChange={(e) => update("industry", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Industry</option>
              {INDUSTRIES.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
            <select required value={form.businessLocation} onChange={(e) => update("businessLocation", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Business Location</option>
              {LOCATIONS.map((opt) => <option key={opt}>{opt}</option>)}
            </select>

            <select required value={form.fundingType} onChange={(e) => update("fundingType", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Funding Type</option>
              {FUNDING_TYPES.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
            <input required type="number" min="1" placeholder="Requested Amount ($)" value={form.requestedAmount} onChange={(e) => update("requestedAmount", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3" />

            <select required value={form.purposeOfFunds} onChange={(e) => update("purposeOfFunds", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3 md:col-span-2">
              <option value="">Purpose of Funds</option>
              {PURPOSES.map((opt) => <option key={opt}>{opt}</option>)}
            </select>

            <select required value={form.salesHistoryYears} onChange={(e) => update("salesHistoryYears", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Years in Business</option>
              {SALES_HISTORY.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
            <select required value={form.annualRevenueRange} onChange={(e) => update("annualRevenueRange", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Annual Revenue</option>
              {ANNUAL_REV.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
            <select required value={form.avgMonthlyRevenueRange} onChange={(e) => update("avgMonthlyRevenueRange", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Average Monthly Revenue</option>
              {MONTHLY_REV.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
            <select required value={form.accountsReceivableRange} onChange={(e) => update("accountsReceivableRange", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Accounts Receivable</option>
              {AR.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
            <select required value={form.fixedAssetsValueRange} onChange={(e) => update("fixedAssetsValueRange", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3 md:col-span-2">
              <option value="">Fixed Assets Value</option>
              {FIXED_ASSETS.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
          </div>

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

          <button type="submit" disabled={submitting} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-70">
            {submitting ? "Submitting..." : "Check Readiness & Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
