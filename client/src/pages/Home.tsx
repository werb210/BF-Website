// BF_WEBSITE_BOREAL_UI_v1
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { APPLY_URL } from "@/config/site";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";
import { trackConversion } from "@/main";

const PHONE_DISPLAY = "+1 (825) 451-1768";
const PRODUCTS = [
  ["term-loan", "Term loans", "A lump sum with fixed, predictable payments. For expansion, a build-out, an acquisition, or any one-time investment you'd rather not fund from cash flow.", "Fixed schedule"],
  ["loc", "Line of credit", "Draw what you need, pay interest only on what you use, repay and draw again. The usual answer to seasonal swings and slow-paying customers.", "Revolving"],
  ["factoring", "Invoice factoring", "Get paid now for invoices your customers will settle in 30, 60 or 90 days. Your receivables are the security, so the decision rests on your customers' credit as much as yours.", "Secured by receivables"],
  ["equipment-financing", "Equipment financing", "Finance machinery, vehicles or technology, new or used. The equipment secures the loan, which usually means a lower rate than unsecured borrowing.", "New or used"],
  ["asset-based-lending", "Asset-based lending", "Borrow against inventory, receivables and equipment together. Suits businesses with a strong balance sheet and lumpy earnings.", "Borrowing base"],
  ["sale-leaseback", "Sale and leaseback", "Free up cash tied in equipment you already own. Sell it to the lender, lease it back, keep using it.", "Releases cash"],
  ["commercial-real-estate", "Commercial real estate", "Purchase, refinance, construction and bridge financing for owner-occupied and investment property.", "Longer timeline"],
] as const;

const STEPS = [
  ["1", "Apply online", "A short form, about five minutes. Business details, what you need the money for, and six months of bank statements. Larger or more complex requests need more, and we'll tell you exactly what before you upload anything."],
  ["2", "We take it to the market", "Our team reviews your file and takes it to the lenders on our panel who fund businesses like yours. You get one point of contact, not twenty. We'll come back with what you qualify for and explain the trade-offs."],
  ["3", "Get funded", "Accept the terms you want and the lender advances the funds. Most files reach funding in three to four days from a complete application."],
] as const;

const REASONS = [
  ["We never pull your credit", "Applying costs you nothing and touches nothing. No hard inquiry from us at any point — and none from a lender until you've signed a term sheet you're happy with. Shopping around here does not damage your file."],
  ["One application, not twenty", "Going direct means repeating yourself to every lender and collecting a rejection from each. You do it once. We take it to the market and come back with the options."],
  ["The lender pays us", "Our fee comes from the lender, not from you, unless we agree something different with you in advance and in writing. You will never be surprised by an invoice from us."],
] as const;

const FAQS = [
  ["Who qualifies?", "Canadian businesses trading at least six months with about $10,000 a month in revenue. We fund established businesses — we don't currently have start-up capital options in Canada. Beyond that, what you qualify for depends on your revenue, your industry and what the money is for."],
  ["Will applying affect my credit?", "No. We do not pull your credit, at any stage. A lender may run a check once you've signed a term sheet, but not before, and only with your agreement."],
  ["How fast can I get funded?", "Most complete applications reach funding in three to four days. Complex files and larger amounts take longer, and we'll tell you which yours is early rather than late."],
  ["What does it cost me?", "Nothing to apply and nothing to be matched. We're paid by the lender that funds you, unless we agree otherwise with you in advance."],
  ["What documents do I need?", "To start: six months of business bank statements and basic details about the company. Larger amounts and some products need financial statements, a rent roll, equipment lists or similar. We'll ask for what your file actually needs rather than everything up front."],
  ["Do you lend in the United States?", "Yes, including SBA 7(a) and 504 through lenders on our US panel. See our US financing pages."],
] as const;

export default function Home() {
  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());
  const onApply = (where: string) => () => trackConversion("apply_click", { where });
  const Apply = ({ where, dark = false }: { where: string; dark?: boolean }) => (
    <a href={applyHref} onClick={onApply(where)} className={`rounded-lg px-6 py-3.5 text-[15px] font-semibold transition ${dark ? "bg-boreal-ink text-white hover:bg-boreal-inkDeep" : "bg-boreal-gold text-boreal-ink hover:bg-[#cfa953]"}`}>Apply now</a>
  );

  return <>
    <SEO title="Business Financing Canada | 80+ Lenders, One Application | Boreal Financial" description="One application matches your business to 80+ Canadian lenders. Term loans, lines of credit, equipment and working capital. Funding in 3-4 days. We never pull your credit." />
    <main className="bg-white font-sans text-boreal-ink">
      <section className="relative overflow-hidden bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={{backgroundImage:"radial-gradient(circle at 18% 20%, rgba(191,155,73,.18), transparent 45%), radial-gradient(circle at 82% 70%, rgba(191,155,73,.10), transparent 40%)"}} />
        <div className="relative mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div><p className="text-[13px] font-semibold uppercase tracking-[.14em] text-boreal-gold">Canada-wide business financing</p><h1 className="mt-4 font-display text-4xl font-bold leading-[1.12] text-white md:text-5xl lg:text-[56px]">One application. 80+ Canadian lenders.</h1><p className="mt-5 max-w-xl text-lg leading-relaxed text-[#c3cfe0]">Tell us about your business once. We match your file to the lenders who fund companies like yours — and you deal with us, not with twenty different application forms.</p><div className="mt-8 flex flex-wrap gap-3.5"><Apply where="hero" /><a href="#how-it-works" className="rounded-lg border border-white/20 bg-white/10 px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-white/[.16]">See how it works</a></div><div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-sm text-boreal-muted"><span>$10K to $100M+</span><span>·</span><span>Funding in 3–4 days</span><span>·</span><strong className="text-white">We never pull your credit</strong></div></div>
          <div className="rounded-2xl bg-white p-7 shadow-[0_30px_60px_rgba(0,0,0,.28)]"><h2 className="font-display text-[22px] font-bold">What you’ll need to start</h2><p className="mt-2 text-sm leading-relaxed text-boreal-body">About five minutes, and these to hand. Larger requests need more, and we ask for it when your file actually needs it.</p><ul className="my-5 space-y-3">{["Six months of business bank statements","Basic details about the company","Roughly what you need and what it's for"].map(x=><li key={x} className="flex gap-3 rounded-xl border border-boreal-line bg-boreal-mist px-4 py-3 text-[15px]"><b className="text-boreal-gold">✓</b>{x}</li>)}</ul><Apply where="hero_card" dark /><p className="mt-4 text-center text-xs text-[#8593aa]">No cost, no obligation, and no impact on your credit.</p></div>
        </div>
      </section>
      <section className="border-b border-boreal-line bg-boreal-mist"><div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-6 py-8 lg:grid-cols-4">{[["80+","Canadian lenders on our panel"],["3–4 days","Typical time to funding"],["$10K–$100M+","Financing arranged"],["$0","Cost to apply or be matched"]].map(([a,b])=><div key={b}><div className="font-display text-3xl font-bold md:text-4xl">{a}</div><div className="mt-1 text-sm text-boreal-body">{b}</div></div>)}</div></section>
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24"><Heading title="The right kind of capital for the job." body="Seven ways to fund payroll, growth, equipment or a gap in cash flow. Not sure which fits? Apply once and we’ll tell you what you qualify for."/><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{PRODUCTS.map(([slug,name,body,meta])=><Link key={slug} href={`/products/${slug}`} className="group rounded-2xl border border-boreal-line p-7 transition hover:border-boreal-gold hover:shadow-lg"><h3 className="font-display text-[22px] font-bold">{name}</h3><p className="mt-2.5 text-[15px] leading-relaxed text-boreal-body">{body}</p><div className="mt-4 border-t border-boreal-line pt-4 text-sm font-semibold">{meta} <span className="text-boreal-gold">→</span></div></Link>)}</div></section>
      <section id="how-it-works" className="border-y border-boreal-line bg-boreal-mist"><div className="mx-auto max-w-[1200px] px-6 py-16 md:py-24"><Heading title="From application to funded in three steps."/><Cards items={STEPS} numbered /></div></section>
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24"><Heading title="Financing that respects your time and your business."/><Cards items={REASONS}/><div className="mt-10"><Apply where="why_boreal" /></div></section>
      <section className="border-y border-boreal-line bg-boreal-mist"><div className="mx-auto max-w-[820px] px-6 py-16 md:py-24"><Heading title="Common questions"/><div className="mt-8 space-y-3">{FAQS.map(([q,a])=><details key={q} className="rounded-xl border border-boreal-line bg-white px-6 py-5"><summary className="cursor-pointer font-display text-[19px] font-bold">{q}</summary><p className="mt-3 text-[15px] leading-relaxed text-boreal-body">{a}</p></details>)}</div></div></section>
      <section className="bg-boreal-ink"><div className="mx-auto max-w-[820px] px-6 py-16 text-center md:py-24"><h2 className="font-display text-3xl font-bold text-white md:text-[44px]">Ready to move your business forward?</h2><p className="mx-auto mt-4 max-w-xl text-lg text-[#c3cfe0]">Apply in about five minutes. No cost, no obligation, and no impact on your credit to see what you qualify for.</p><div className="mt-8 flex flex-wrap justify-center gap-3.5"><Apply where="footer_cta"/><a href="tel:+18254511768" onClick={onApply("phone")} className="rounded-lg border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white">{PHONE_DISPLAY}</a></div></div></section>
    </main>
  </>;
}

function Heading({title,body}:{title:string;body?:string}) { return <div className="max-w-[640px]"><h2 className="font-display text-3xl font-bold md:text-[44px] md:leading-tight">{title}</h2>{body&&<p className="mt-4 text-lg leading-relaxed text-boreal-body">{body}</p>}</div> }
function Cards({items,numbered=false}:{items:readonly (readonly string[])[];numbered?:boolean}) { return <div className="mt-10 grid gap-6 md:grid-cols-3">{items.map(([n,title,body])=>{const heading=numbered?title:n; const copy=numbered?body:title; return <div key={heading} className="rounded-2xl border border-boreal-line bg-white p-7">{numbered&&<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-boreal-ink font-display font-bold text-white">{n}</div>}<h3 className="mt-5 font-display text-[22px] font-bold">{heading}</h3><p className="mt-2.5 text-[15px] leading-relaxed text-boreal-body">{copy}</p></div>})}</div> }
