// BF_WEBSITE_BLOCK_v124_READINESS_AND_CONTACT_HANDOFF_v1
import { FormEvent, useEffect, useState } from "react";
import { estimateCommissionValue, trackConversion, trackEvent, trackLeadProfile } from "@/main";
import { useLocation } from "wouter";
import { apiUrl } from "@/config/env"; // BF_WEBSITE_v789_ONE_API_BASE
import { scoreCreditReadiness } from "@/lib/creditReadinessScore";
// BF_WEBSITE_SWA_FALLBACK_v13
import SEO from "@/components/SEO";
// BF_WEBSITE_BLOCK_v129c_PHONE_NORMALIZATION_v1
import { formatPhone, formatCurrency, unformatCurrency, toE164, PHONE_PATTERN, PHONE_TITLE } from "@/utils/formatters";
import { caslFields } from "@/lib/casl"; // BF_WEBSITE_v789_CASL
import CaslConsent from "@/components/CaslConsent";

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

// BF_WEBSITE_v789_FORM_LABELS - every field has a visible label. Placeholders
// are #6b7280 (4.8:1 on white); the browser default grey failed.
const labelClass = "mb-1.5 block text-sm font-semibold text-boreal-ink";
const fieldClass =
  "w-full rounded-lg border border-boreal-line bg-white p-3 text-boreal-ink outline-none transition placeholder:text-[#6b7280] focus:border-boreal-gold focus:ring-2 focus:ring-boreal-gold/20";

export default function CreditReadiness() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<ReadinessForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caslConsent, setCaslConsent] = useState(false); // BF_WEBSITE_v789_CASL

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
        ...caslFields(caslConsent), // BF_WEBSITE_v789_CASL
      };
      const response = await fetch(apiUrl("/website/credit-readiness"), {
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
    <>
      <SEO
        title="See What Your Business Could Qualify For | Boreal Financial"
        description="Answer a few questions and we'll tell you which kinds of financing are realistic. Two minutes, no documents needed, and no credit check."
      />
      <main className="bg-white font-sans text-boreal-ink">
      <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
        <div className="mx-auto max-w-[820px] px-6 py-14 md:py-20">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-boreal-gold">
            Free, and it doesn&rsquo;t touch your credit
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-5xl">
            See what you could qualify for
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#c3cfe0]">
            Answer a few questions about your business and we&rsquo;ll tell you which kinds of
            financing are realistic and what a lender will want to see. Two minutes, no documents
            needed yet, and no credit check &mdash; we don&rsquo;t pull it.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[820px] px-6 py-12 md:py-16">
        <form
          autoComplete="on"
          onSubmit={handleSubmit}
          className="rounded-2xl border border-boreal-line bg-white p-6 md:p-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="readiness-company-name" className={labelClass}>Company name</label>
              <input id="readiness-company-name" name="companyName" required type="text" autoComplete="organization" placeholder="Company Name" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label htmlFor="readiness-full-name" className={labelClass}>Full name</label>
              <input id="readiness-full-name" name="fullName" required type="text" autoComplete="name" placeholder="Full Name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label htmlFor="readiness-email" className={labelClass}>Email</label>
              <input id="readiness-email" name="email" required type="email" autoComplete="email" inputMode="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label htmlFor="readiness-phone" className={labelClass}>Mobile phone</label>
              <input id="readiness-phone" name="phone" required type="tel" autoComplete="tel" inputMode="tel" placeholder="Mobile Phone" pattern={PHONE_PATTERN} title={PHONE_TITLE} value={form.phone} onChange={(e) => update("phone", formatPhone(e.target.value))} className={fieldClass} />
            </div>

            <div>
              <label htmlFor="readiness-industry" className={labelClass}>Industry</label>
              <select id="readiness-industry" name="industry" required value={form.industry} onChange={(e) => update("industry", e.target.value)} className={fieldClass}>
                <option value="">Industry</option>
                {INDUSTRIES.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="readiness-business-location" className={labelClass}>Business location</label>
              <select id="readiness-business-location" name="businessLocation" required value={form.businessLocation} onChange={(e) => update("businessLocation", e.target.value)} className={fieldClass}>
                <option value="">Business Location</option>
                {LOCATIONS.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="readiness-requested-amount" className={labelClass}>Requested amount ($)</label>
              <input id="readiness-requested-amount" name="requestedAmount" required type="text" inputMode="numeric" placeholder="Requested Amount ($)" value={form.requestedAmount} onChange={(e) => update("requestedAmount", formatCurrency(e.target.value))} className={fieldClass} />
            </div>

            <div>
              <label htmlFor="readiness-purpose-of-funds" className={labelClass}>Purpose of funds</label>
              <select id="readiness-purpose-of-funds" name="purposeOfFunds" required value={form.purposeOfFunds} onChange={(e) => update("purposeOfFunds", e.target.value)} className={fieldClass}>
                <option value="">Purpose of Funds</option>
                {PURPOSES.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="readiness-sales-history-years" className={labelClass}>Years in business</label>
              <select id="readiness-sales-history-years" name="salesHistoryYears" required value={form.salesHistoryYears} onChange={(e) => update("salesHistoryYears", e.target.value)} className={fieldClass}>
                <option value="">Years in Business</option>
                {SALES_HISTORY.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="readiness-annual-revenue-range" className={labelClass}>Annual revenue</label>
              <select id="readiness-annual-revenue-range" name="annualRevenueRange" required value={form.annualRevenueRange} onChange={(e) => update("annualRevenueRange", e.target.value)} className={fieldClass}>
                <option value="">Annual Revenue</option>
                {ANNUAL_REV.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="readiness-avg-monthly-revenue-range" className={labelClass}>Average monthly revenue</label>
              <select id="readiness-avg-monthly-revenue-range" name="avgMonthlyRevenueRange" required value={form.avgMonthlyRevenueRange} onChange={(e) => update("avgMonthlyRevenueRange", e.target.value)} className={fieldClass}>
                <option value="">Average Monthly Revenue</option>
                {MONTHLY_REV.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="readiness-accounts-receivable-range" className={labelClass}>Accounts receivable</label>
              <select id="readiness-accounts-receivable-range" name="accountsReceivableRange" required value={form.accountsReceivableRange} onChange={(e) => update("accountsReceivableRange", e.target.value)} className={fieldClass}>
                <option value="">Accounts Receivable</option>
                {AR.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="readiness-fixed-assets-value-range" className={labelClass}>Fixed assets value</label>
              <select id="readiness-fixed-assets-value-range" name="fixedAssetsValueRange" required value={form.fixedAssetsValueRange} onChange={(e) => update("fixedAssetsValueRange", e.target.value)} className={fieldClass}>
                <option value="">Fixed Assets Value</option>
                {FIXED_ASSETS.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* BF_WEBSITE_v789_CASL */}
          <div className="mt-6">
            <CaslConsent id="readiness-casl-consent" checked={caslConsent} onChange={setCaslConsent} />
          </div>

          {/* BF_WEBSITE_v789_READABILITY - was a pale red (red-300) on white, 1.9:1; #b91c1c is 6.5:1. */}
          {error ? <p role="alert" className="mt-4 text-sm font-medium text-[#b91c1c]">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-boreal-gold py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:bg-[#cfa953] disabled:opacity-70"
          >
            {submitting ? "Checking\u2026" : "See what I could qualify for"}
          </button>
          <p className="mt-3 text-center text-[12px] leading-snug text-boreal-body">
            No cost, no obligation, and no impact on your credit.
          </p>
        </form>
      </div>
    </main>
    </>
  );
}
