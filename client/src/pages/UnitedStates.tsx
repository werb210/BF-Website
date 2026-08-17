import { Link } from "wouter";
import SEO from "@/components/SEO";
import { APPLY_URL } from "@/config/site";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";
import { trackConversion } from "@/main";
import { organizationJsonLd } from "@/lib/structured-data";

const PHONE_DISPLAY = "+1 (825) 451-1768";

const PRODUCTS = [
  ["sba", "SBA 7(a) and 504", "Government-guaranteed loans with longer terms and lower payments than conventional debt. 7(a) for working capital, acquisition and refinancing; 504 for owner-occupied property and heavy equipment.", "United States only"],
  ["term-loan", "Term loans", "A lump sum with fixed, predictable payments. For expansion, a build-out, an acquisition, or any one-time investment you would rather not fund from cash flow.", "Fixed schedule"],
  ["loc", "Line of credit", "Draw what you need, pay interest only on what you use, repay and draw again. The usual answer to seasonal swings and slow-paying customers.", "Revolving"],
  ["factoring", "Invoice factoring", "Get paid now for invoices your customers will settle in 30, 60 or 90 days. Your receivables are the security, so the decision rests on your customers' credit as much as yours.", "Secured by receivables"],
  ["equipment-financing", "Equipment financing", "Finance machinery, vehicles or technology, new or used. The equipment secures the loan, which usually means a lower rate than unsecured borrowing.", "New or used"],
  ["commercial-real-estate", "Commercial real estate", "Purchase, refinance, construction and bridge financing for owner-occupied and investment property.", "Longer timeline"],
] as const;

const STEPS = [
  ["1", "Apply online", "A short form, about five minutes. Business details, what you need the money for, and six months of bank statements. Larger or more complex requests need more, and we will tell you exactly what before you upload anything."],
  ["2", "We take it to the market", "Our team reviews your file and takes it to the lenders on our US panel who fund businesses like yours. You get one point of contact, not twenty. We come back with what you qualify for and explain the trade-offs."],
  ["3", "Get funded", "Accept the terms you want and the lender advances the funds. Most files reach funding in three to four days from a complete application. SBA runs longer, and we say so up front."],
] as const;

const FAQS = [
  ["Who qualifies?", "It depends on the product. Conventional working capital generally needs trading history and steady revenue; SBA has its own eligibility rules and is open to some start-ups. Apply once and we will tell you which doors are actually open to you."],
  ["Will applying affect my credit?", "No. We do not pull your credit, at any stage. A lender may run a check once you have signed a term sheet, but not before, and only with your agreement."],
  ["How fast can I get funded?", "Most complete conventional applications reach funding in three to four days. SBA takes considerably longer by design, and we will tell you which yours is early rather than late."],
  ["What does it cost me?", "Nothing to apply and nothing to be matched. We are paid by the lender that funds you, unless we agree otherwise with you in advance and in writing."],
  ["Do you also work in Canada?", "Yes. Boreal is a Canadian and US marketplace. If your business is Canadian, start on our Canadian page instead."],
] as const;

export default function UnitedStates() {
  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());
  const onApply = (where: string) => () => trackConversion("apply_click", { where, market: "us" });
  const Apply = ({ where, dark = false }: { where: string; dark?: boolean }) => (
    <a href={applyHref} onClick={onApply(where)} className={`rounded-lg px-6 py-3.5 text-[15px] font-semibold transition ${dark ? "bg-boreal-ink text-white hover:bg-boreal-inkDeep" : "bg-boreal-gold text-boreal-ink hover:bg-[#cfa953]"}`}>Apply now</a>
  );

  return <>
    <SEO title="Business Financing USA | One Application, Many Lenders | Boreal Financial" description="One application reaches the US lenders that fund businesses like yours. SBA 7(a) and 504, term loans, lines of credit, equipment and working capital. We never pull your credit." url="https://www.boreal.financial/us" schema={[organizationJsonLd, { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }]} />
    <main className="bg-white font-sans text-boreal-ink">
      <section className="relative overflow-hidden bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 18% 20%, rgba(191,155,73,.18), transparent 45%), radial-gradient(circle at 82% 70%, rgba(191,155,73,.10), transparent 40%)" }} />
        <div className="relative mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div><p className="text-[13px] font-semibold uppercase tracking-[.14em] text-boreal-gold">United States business financing</p><h1 className="mt-4 font-display text-4xl font-bold leading-[1.12] text-white md:text-5xl lg:text-[56px]">One application. The lenders that actually fit.</h1><p className="mt-5 max-w-xl text-lg leading-relaxed text-[#c3cfe0]">Tell us about your business once. We take your file to the US lenders who fund companies like yours, including SBA 7(a) and 504 — and you deal with us, not with twenty different application forms.</p><div className="mt-8 flex flex-wrap gap-3.5"><Apply where="hero" /><a href="#how-it-works" className="rounded-lg border border-white/20 bg-white/10 px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-white/[.16]">See how it works</a></div><div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-sm text-boreal-muted"><span>$10K to $100M+</span><span>·</span><span>SBA 7(a) and 504</span><span>·</span><strong className="text-white">We never pull your credit</strong></div></div>
          <div className="rounded-2xl bg-white p-7 shadow-[0_30px_60px_rgba(0,0,0,.28)]"><h2 className="font-display text-[22px] font-bold">What you will need to start</h2><p className="mt-2 text-sm leading-relaxed text-boreal-body">About five minutes, and these to hand. Larger requests need more, and we ask for it when your file actually needs it.</p><ul className="my-5 space-y-3">{["Six months of business bank statements", "Basic details about the company", "Roughly what you need and what it is for"].map((x) => <li key={x} className="flex gap-3 rounded-xl border border-boreal-line bg-boreal-mist px-4 py-3 text-[15px]"><b className="text-boreal-gold">✓</b>{x}</li>)}</ul><Apply where="hero_card" dark /><p className="mt-4 text-center text-sm text-[#96a3b8]">No cost, no obligation, and no impact on your credit.</p></div>
        </div>
      </section>
      <section className="border-b border-boreal-line bg-boreal-mist"><div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-6 py-8 lg:grid-cols-4">{[["SBA", "7(a) and 504 arranged"], ["3–4 days", "Typical conventional funding"], ["$10K–$100M+", "Financing arranged"], ["$0", "Cost to apply or be matched"]].map(([a, b]) => <div key={b}><div className="font-display text-3xl font-bold md:text-4xl">{a}</div><div className="mt-1 text-sm text-boreal-body">{b}</div></div>)}</div></section>
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24"><div className="max-w-[640px]"><h2 className="font-display text-3xl font-bold md:text-[44px] md:leading-tight">The right kind of capital for the job.</h2><p className="mt-4 text-lg leading-relaxed text-boreal-body">Different problems need different money. Not sure which fits? Apply once and we will tell you what you qualify for.</p></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{PRODUCTS.map(([slug, name, body, meta]) => <Link key={slug} href={`/products/${slug}`} className="group rounded-2xl border border-boreal-line p-7 transition hover:border-boreal-gold hover:shadow-lg"><h3 className="font-display text-[22px] font-bold">{name}</h3><p className="mt-2.5 text-[15px] leading-relaxed text-boreal-body">{body}</p><div className="mt-4 border-t border-boreal-line pt-4 text-sm font-semibold">{meta} <span className="text-boreal-gold">→</span></div></Link>)}</div></section>
      <section id="how-it-works" className="border-y border-boreal-line bg-boreal-mist"><div className="mx-auto max-w-[1200px] px-6 py-16 md:py-24"><div className="max-w-[640px]"><h2 className="font-display text-3xl font-bold md:text-[44px] md:leading-tight">From application to funded in three steps.</h2></div><div className="mt-10 grid gap-6 md:grid-cols-3">{STEPS.map(([n, title, body]) => <div key={title} className="rounded-2xl border border-boreal-line bg-white p-7"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-boreal-ink font-display font-bold text-white">{n}</div><h3 className="mt-5 font-display text-[22px] font-bold">{title}</h3><p className="mt-2.5 text-[15px] leading-relaxed text-boreal-body">{body}</p></div>)}</div></div></section>
      <section className="mx-auto max-w-[820px] px-6 py-16 md:py-24"><div className="max-w-[640px]"><h2 className="font-display text-3xl font-bold md:text-[44px] md:leading-tight">Common questions</h2></div><div className="mt-8 space-y-3">{FAQS.map(([q, a]) => <details key={q} className="rounded-xl border border-boreal-line bg-white px-6 py-5"><summary className="cursor-pointer font-display text-[19px] font-bold">{q}</summary><p className="mt-3 text-[15px] leading-relaxed text-boreal-body">{a}</p></details>)}</div><p className="mt-8 text-[15px] text-boreal-body">Canadian business? <Link href="/" className="font-semibold text-boreal-ink underline">Start here instead</Link>.</p></section>
      <section className="bg-boreal-ink"><div className="mx-auto max-w-[820px] px-6 py-16 text-center md:py-24"><h2 className="font-display text-3xl font-bold text-white md:text-[44px]">Ready to move your business forward?</h2><p className="mx-auto mt-4 max-w-xl text-lg text-[#c3cfe0]">Apply in about five minutes. No cost, no obligation, and no impact on your credit to see what you qualify for.</p><div className="mt-8 flex flex-wrap justify-center gap-3.5"><Apply where="footer_cta" /><a href="tel:+18254511768" onClick={onApply("phone")} className="rounded-lg border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white">{PHONE_DISPLAY}</a></div></div></section>
    </main>
  </>;
}
