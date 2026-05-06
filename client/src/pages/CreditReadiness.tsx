// BF_WEBSITE_BLOCK_v124_READINESS_AND_CONTACT_HANDOFF_v1
import { FormEvent, useEffect, useState } from "react";
import { estimateCommissionValue, trackConversion, trackEvent, trackLeadProfile } from "@/main";
import { useLocation } from "wouter";
import { WEBSITE_API_BASE } from "@/config/api";
import { scoreCreditReadiness } from "@/lib/creditReadinessScore";
// BF_WEBSITE_BLOCK_v129c_PHONE_NORMALIZATION_v1
import { formatPhone, formatCurrency, unformatCurrency, toE164 } from "@/utils/formatters";

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

const CREDIT_RESULT_STORAGE_KEY = "boreal.credit-readiness.result";

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
      // BF_WEBSITE_BLOCK_v129c_PHONE_NORMALIZATION_v1
      // Normalize phone to E.164 before submit so the server stores
      // the canonical form on the readiness_session row. The server
      // (v129a) also normalizes defensively, but client-side
      // normalization keeps the contract and network logs unambiguous.
      // toE164 returns "" for malformed input — fall back to raw so
      // the server's existing required-field check still triggers.
      const e164Phone = toE164(form.phone);
      const submitPayload = {
        ...form,
        phone: e164Phone || form.phone,
        requestedAmount: unformatCurrency(form.requestedAmount),
      };
      const response = await fetch(`${WEBSITE_API_BASE}/api/website/credit-readiness`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitPayload),
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

      const computed = scoreCreditReadiness({
        salesHistoryYears: form.salesHistoryYears,
        annualRevenueRange: form.annualRevenueRange,
        avgMonthlyRevenueRange: form.avgMonthlyRevenueRange,
        accountsReceivableRange: form.accountsReceivableRange,
        fixedAssetsValueRange: form.fixedAssetsValueRange,
        requestedAmount: form.requestedAmount,
      });

      sessionStorage.setItem(
        CREDIT_RESULT_STORAGE_KEY,
        JSON.stringify({
          score: computed.score,
          tier: computed.tier,
          capitalRange: form.annualRevenueRange,
          companyName: form.companyName,
          // BF_WEBSITE_BLOCK_v129c_PHONE_NORMALIZATION_v1 — store E.164
          // so any consumer (deep-link to /apply, Hubspot mirror, etc.)
          // matches what the OTP page will produce on verify.
          phone: e164Phone || form.phone,
          redirect: body.redirect ?? null,
        }),
      );

      const strength: "strong" | "moderate" | "weak" =
        computed.tier === "green" ? "strong" : computed.tier === "yellow" ? "moderate" : "weak";
      trackLeadProfile({
        strength,
        industry: form.industry,
        capital_range: form.annualRevenueRange,
        collateral_type: form.fixedAssetsValueRange,
      });

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
            <input required type="tel" autoComplete="tel" inputMode="tel" placeholder="Mobile Phone" value={form.phone} onChange={(e) => update("phone", formatPhone(e.target.value))} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3" />

            <select required value={form.industry} onChange={(e) => update("industry", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Industry</option>
              {INDUSTRIES.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
            <select required value={form.businessLocation} onChange={(e) => update("businessLocation", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
              <option value="">Business Location</option>
              {LOCATIONS.map((opt) => <option key={opt}>{opt}</option>)}
            </select>

            <input required type="text" inputMode="numeric" placeholder="Requested Amount ($)" value={form.requestedAmount} onChange={(e) => update("requestedAmount", formatCurrency(e.target.value))} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3" />

            <select required value={form.purposeOfFunds} onChange={(e) => update("purposeOfFunds", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
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
            <select required value={form.fixedAssetsValueRange} onChange={(e) => update("fixedAssetsValueRange", e.target.value)} className="w-full rounded border border-slate-700 bg-[#0b213f] p-3">
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
