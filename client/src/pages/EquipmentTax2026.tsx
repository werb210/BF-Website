// BF_WEBSITE_EQUIPMENT_TAX_2026_v1 - Budget 2026 Productivity Mega Deduction calculator.
// Illustrative only: compares the year-one deduction under the previous capital cost allowance rates with the
// proposed 100% immediate deduction (eligible assets acquired on or after September 15, 2026), turns the
// difference into an estimated tax saving at the chosen rate, and shows how many months of finance payments that
// saving would cover. Source: Budget 2026, "Canada's Investment Supercycle" (pp. 40, 113-114).
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { APPLY_URL } from "@/config/site";
import { trackConversion } from "@/main";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";

import { ASSET_KINDS, PROVINCES, RATE_TYPES, calculate, pct, provinceRate, type AssetKind } from "@/lib/equipmentTax";

const money = (n: number) => n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const num = (v: string) => {
  const n = Number(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const field = "mt-1.5 w-full rounded-lg border border-boreal-line bg-white px-3.5 py-3 text-[16px] text-boreal-ink focus:border-boreal-ink focus:outline-none";
const label = "block text-[14px] font-semibold text-boreal-ink";

export default function EquipmentTax2026() {
  const [cost, setCost] = useState("250000");
  const [kind, setKind] = useState("construction");
  const [province, setProvince] = useState("AB");
  const [taxId, setTaxId] = useState("general");
  const [customTax, setCustomTax] = useState("15");
  const [financeRate, setFinanceRate] = useState("9.5");
  const [term, setTerm] = useState("60");
  const [down, setDown] = useState("0");

  const asset: AssetKind = ASSET_KINDS.find((a) => a.id === kind) ?? (ASSET_KINDS[0] as AssetKind);
  const taxRate = taxId === "custom" ? num(customTax) / 100 : provinceRate(province, taxId);
  const r = useMemo(
    () => calculate({ cost: num(cost), previousRate: asset.previousRate, taxRate, financeRatePct: num(financeRate), termMonths: Math.round(num(term)), downPayment: num(down) }),
    [cost, asset.previousRate, taxRate, financeRate, term, down],
  );

  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());
  const apply = (where: string) => trackConversion("apply_click", { where: `equipment_tax_2026_${where}`, amount: num(cost), asset: kind });

  return (
    <>
      <SEO
        title="Budget 2026 Equipment Tax Calculator | Productivity Mega Deduction | Boreal Financial"
        description="See what Canada's proposed 100% immediate deduction could mean for your next equipment purchase, and how many months of finance payments the tax saving could cover."
      />
      <main className="bg-white font-sans text-boreal-ink">
        <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
          <div className="mx-auto max-w-[1100px] px-6 py-14 md:py-20">
            <p className="text-[13px] font-semibold uppercase tracking-[.14em] text-boreal-gold">Federal Budget 2026</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-5xl">What the new equipment deduction could mean for your business</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#c3cfe0]">
              The budget proposes the <strong className="text-white">Productivity Mega Deduction</strong>: businesses of all sizes could deduct the full cost of qualifying equipment
              acquired on or after <strong className="text-white">September 15, 2026</strong> in the year it goes into use. Previously most equipment was written off a portion each year.
              Try your own numbers below.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1100px] gap-8 px-6 py-12 md:grid-cols-[1fr_1.1fr] md:py-16">
          <form className="space-y-5 rounded-2xl border border-boreal-line bg-boreal-mist p-6 md:p-8" onSubmit={(e) => e.preventDefault()} aria-label="Equipment tax calculator">
            <h2 className="font-display text-2xl font-bold">Your purchase</h2>
            <label className={label}>
              Equipment cost (before tax)
              <input className={field} inputMode="numeric" value={cost} onChange={(e) => setCost(e.target.value)} aria-describedby="cost-help" />
              <span id="cost-help" className="mt-1 block text-[13px] font-normal text-boreal-body">{money(num(cost))}</span>
            </label>
            <label className={label}>
              Kind of equipment
              <select className={field} value={kind} onChange={(e) => setKind(e.target.value)}>
                {ASSET_KINDS.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
              <span className="mt-1 block text-[13px] font-normal text-boreal-body">For example: {asset.examples}.</span>
            </label>
            <label className={label}>
              Province
              <select className={field} value={province} onChange={(e) => setProvince(e.target.value)} data-testid="province">
                {PROVINCES.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </label>
            <label className={label}>
              Your business's tax rate
              <select className={field} value={taxId} onChange={(e) => setTaxId(e.target.value)}>
                {RATE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id === "custom" ? t.label : `${t.label} (about ${pct(provinceRate(province, t.id))})`}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-[13px] font-normal text-boreal-body">Combined federal and provincial rate. Most smaller corporations pay the small business rate on their first $500,000 of active business income.</span>
            </label>
            {taxId === "custom" ? (
              <label className={label}>
                Tax rate (%)
                <input className={field} inputMode="decimal" value={customTax} onChange={(e) => setCustomTax(e.target.value)} />
              </label>
            ) : null}
            <h3 className="pt-2 font-display text-lg font-bold">If you finance it</h3>
            <div className="grid grid-cols-3 gap-3">
              <label className={label}>
                Down payment
                <input className={field} inputMode="numeric" value={down} onChange={(e) => setDown(e.target.value)} />
              </label>
              <label className={label}>
                Rate (%)
                <input className={field} inputMode="decimal" value={financeRate} onChange={(e) => setFinanceRate(e.target.value)} />
              </label>
              <label className={label}>
                Months
                <input className={field} inputMode="numeric" value={term} onChange={(e) => setTerm(e.target.value)} />
              </label>
            </div>
            <p className="text-[13px] text-boreal-body">Rates and terms are examples only; your actual offer depends on the lender and your file.</p>
          </form>

          <div className="space-y-5" aria-live="polite">
            <div className="rounded-2xl border border-boreal-line p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold">Year-one deduction</h2>
              <dl className="mt-5 space-y-3 text-[16px]">
                <div className="flex justify-between gap-4"><dt className="text-boreal-body">Previous rules (about {Math.round(asset.previousRate * 100)}% in year one)</dt><dd className="font-semibold" data-testid="before">{money(r.before)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-boreal-body">Proposed rules (100%)</dt><dd className="font-semibold" data-testid="after">{money(r.after)}</dd></div>
                <div className="flex justify-between gap-4 border-t border-boreal-line pt-3"><dt className="font-semibold">Extra deduction in year one</dt><dd className="font-bold" data-testid="extra">{money(r.extraDeduction)}</dd></div>
              </dl>
            </div>
            <div className="rounded-2xl bg-boreal-ink p-6 text-white md:p-8">
              <p className="text-[14px] font-semibold uppercase tracking-[.12em] text-boreal-gold">Estimated year-one tax saving</p>
              <p className="mt-2 font-display text-5xl font-bold" data-testid="saving">{money(r.taxSaving)}</p>
              {r.payment > 0 ? (
                <p className="mt-4 text-[16px] leading-relaxed text-[#c3cfe0]">
                  Financing {money(r.financed)} at {num(financeRate)}% over {Math.round(num(term))} months is about <strong className="text-white">{money(r.payment)} a month</strong>.
                  The year-one tax saving would cover about <strong className="text-white" data-testid="months">{r.monthsCovered.toFixed(1)} months</strong> of payments.
                </p>
              ) : null}
              <p className="mt-4 text-[14px] text-[#9fb0c7]">This is a timing benefit: you deduct the full cost now instead of over several years.</p>
              <a href={applyHref} onClick={() => apply("results")} className="mt-6 inline-block rounded-lg bg-boreal-gold px-6 py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:bg-[#cfa953]" data-testid="apply">
                Apply for equipment financing — about five minutes
              </a>
              <a href="/book" onClick={() => trackConversion("book_click", { where: "equipment_tax_2026" })} className="ml-0 mt-3 block text-[15px] font-semibold text-white underline md:ml-4 md:mt-0 md:inline-block">
                Or book a call
              </a>
            </div>
          </div>
        </section>

        <section className="border-y border-boreal-line bg-boreal-mist">
          <div className="mx-auto max-w-[820px] px-6 py-12">
            <h2 className="font-display text-2xl font-bold">Good to know</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] leading-relaxed text-boreal-body">
              <li>About two thirds of capital assets would qualify, compared with roughly 15% before. The measure is intended to be permanent.</li>
              <li>The budget lists examples across construction, farming, transportation, manufacturing, restaurants, health care and media production. The list is illustrative.</li>
              <li>Limited exclusions apply: very long-lived assets, assets with a significant personal-use component (such as many passenger vehicles), and assets subject to regulated rates.</li>
              <li>The deduction is for owning the asset. Paying cash or financing a purchase both count when your business owns it; leases can be treated differently, so ask your accountant.</li>
              <li>It is a deduction against taxable income, not a grant or rebate. Its value depends on your business's tax position.</li>
            </ul>
            <a href={applyHref} onClick={() => apply("footer")} className="mt-7 inline-block rounded-lg bg-boreal-gold px-6 py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:bg-[#cfa953]">Apply now</a>
            <p className="mt-8 text-[13px] leading-relaxed text-boreal-body">
              Illustrative estimate only, not tax advice. "Previous rules" uses approximate year-one capital cost allowance rates for each kind of equipment; actual classes and rates vary. Tax rates are approximate combined federal and provincial corporate rates. The proposed
              treatment is subject to legislation being passed, and the Canada Revenue Agency will decide whether specific assets qualify. Consult your tax advisor. Financing is subject to lender approval.
              Source: Federal Budget 2026, "Canada's Investment Supercycle".
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
