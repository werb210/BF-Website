import { FormEvent, useMemo, useState } from "react";
import { APPLY_URL } from "@/config/site";

type FormState = {
  industry: string;
  yearsInBusiness: string;
  monthlyRevenue: string;
  annualRevenue: string;
  existingDebt: string;
  fundingNeeded: string;
};

const initialState: FormState = {
  industry: "",
  yearsInBusiness: "",
  monthlyRevenue: "",
  annualRevenue: "",
  existingDebt: "",
  fundingNeeded: "",
};

const recommendations = {
  strong: [
    "Prepare your latest financial package and AR/AP aging before lender review.",
    "Document top contracts or customer concentration detail to improve lender confidence.",
    "Select the product structure that best matches your cash conversion cycle.",
  ],
  moderate: [
    "Tighten monthly reporting and maintain clear cash-flow forecasting for 13 weeks.",
    "Reduce avoidable debt utilization where possible before submitting your file.",
    "Gather key operational KPIs to support underwriting narrative.",
    "Clarify the exact use-of-funds plan to strengthen your application.",
  ],
  needs: [
    "Build at least 6 months of clean financial statements and reconciled accounts.",
    "Lower payment delinquencies and simplify outstanding debt obligations.",
    "Improve revenue consistency and document recurring clients where possible.",
    "Work with an advisor to select a smaller entry facility before larger funding.",
    "Create a written capital plan tied to milestones and repayment assumptions.",
  ],
};

function scoreReadiness(form: FormState) {
  let score = 0;

  const years = Number(form.yearsInBusiness);
  if (years >= 5) score += 20;
  else if (years >= 2) score += 14;
  else if (years >= 1) score += 8;
  else score += 3;

  const monthlyScores: Record<string, number> = {
    "0-50k": 6,
    "50k-100k": 12,
    "100k-250k": 16,
    "250k+": 20,
  };

  const annualScores: Record<string, number> = {
    "0-500k": 6,
    "500k-1m": 12,
    "1m-5m": 16,
    "5m+": 20,
  };

  const fundingScores: Record<string, number> = {
    "0-100k": 14,
    "100k-500k": 12,
    "500k-1m": 9,
    "1m+": 6,
  };

  score += monthlyScores[form.monthlyRevenue] ?? 0;
  score += annualScores[form.annualRevenue] ?? 0;
  score += fundingScores[form.fundingNeeded] ?? 0;
  score += form.existingDebt === "no" ? 18 : 10;
  score += form.industry ? 8 : 0;

  return Math.min(100, score);
}

export default function CapitalReadinessScore() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => scoreReadiness(form), [form]);

  const tier = score >= 80 ? "Strong" : score >= 60 ? "Moderate" : "Needs Strengthening";
  const tierKey = score >= 80 ? "strong" : score >= 60 ? "moderate" : "needs";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-12">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Capital Readiness Score</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">Assess how prepared you are for financing</h1>
          <p className="mt-4 text-lg text-slate-600">
            Complete a quick intake to receive a deterministic score, readiness tier, and practical next steps.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Industry
              <select
                required
                value={form.industry}
                onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
              >
                <option value="">Select one</option>
                <option>Construction</option>
                <option>Manufacturing</option>
                <option>Logistics</option>
                <option>Distribution</option>
                <option>Media</option>
                <option>Healthcare</option>
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Years in business
              <input
                required
                type="number"
                min={0}
                value={form.yearsInBusiness}
                onChange={(event) => setForm((prev) => ({ ...prev, yearsInBusiness: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Monthly revenue range
              <select
                required
                value={form.monthlyRevenue}
                onChange={(event) => setForm((prev) => ({ ...prev, monthlyRevenue: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
              >
                <option value="">Select one</option>
                <option value="0-50k">$0 - $50K</option>
                <option value="50k-100k">$50K - $100K</option>
                <option value="100k-250k">$100K - $250K</option>
                <option value="250k+">$250K+</option>
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Annual revenue range
              <select
                required
                value={form.annualRevenue}
                onChange={(event) => setForm((prev) => ({ ...prev, annualRevenue: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
              >
                <option value="">Select one</option>
                <option value="0-500k">$0 - $500K</option>
                <option value="500k-1m">$500K - $1M</option>
                <option value="1m-5m">$1M - $5M</option>
                <option value="5m+">$5M+</option>
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Existing debt?
              <select
                required
                value={form.existingDebt}
                onChange={(event) => setForm((prev) => ({ ...prev, existingDebt: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
              >
                <option value="">Select one</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Funding amount needed
              <select
                required
                value={form.fundingNeeded}
                onChange={(event) => setForm((prev) => ({ ...prev, fundingNeeded: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
              >
                <option value="">Select one</option>
                <option value="0-100k">$0 - $100K</option>
                <option value="100k-500k">$100K - $500K</option>
                <option value="500k-1m">$500K - $1M</option>
                <option value="1m+">$1M+</option>
              </select>
            </label>

            <div className="md:col-span-2">
              <button type="submit" className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                Calculate Score
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Your Readiness Result</p>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <p className="text-4xl md:text-5xl font-bold text-slate-900">{score}</p>
              <p className="mb-2 rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white">{tier}</p>
            </div>

            <h2 className="mt-8 text-2xl font-semibold text-slate-900">Recommendations</h2>
            <ul className="mt-4 space-y-3 text-slate-700">
              {recommendations[tierKey].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={APPLY_URL} className="inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                Apply Now
              </a>
              <a href="/contact" className="inline-flex rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Contact Us
              </a>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Recalculate
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
