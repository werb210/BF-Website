// BF_WEBSITE_PRODUCT_DETAIL_v6
// Product detail rebuilt to the approved design system. SHOW_RANGES stays false:
// rates vary by amount and product and are deliberately never published.
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { productContentBySlug, PRODUCT_CONTENT } from "@/data/productContent";
import { industries } from "@/data/industries";
import { APPLY_URL } from "@/config/site";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";
import { trackConversion } from "@/main";

const SHOW_RANGES = false;
const slugAliases: Record<string, string> = {
  "line-of-credit": "loc", "lines-of-credit": "loc", "term-loans": "term-loan",
  "purchase-order-financing": "po-financing", "invoice-factoring": "factoring",
  "sba-loans": "sba", "commercial-mortgage": "commercial-real-estate",
};
const card = "rounded-2xl border border-boreal-line bg-white p-7";
const eyebrow = "text-[12px] font-semibold uppercase tracking-[0.14em] text-boreal-gold";
const h2 = "mt-2 font-display text-2xl font-bold text-boreal-ink";

export default function ProductDetail({ slug }: { slug: string }) {
  const p = productContentBySlug(slugAliases[slug] ?? slug);
  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());
  if (!p) return <main className="bg-white font-sans text-boreal-ink"><div className="mx-auto max-w-[820px] px-6 py-20 text-center"><h1 className="font-display text-3xl font-bold">We don&rsquo;t have a page for that</h1><p className="mt-4 text-[16px] text-boreal-body">It may have moved, or we may not place that product. Here&rsquo;s what we do.</p><Link href="/products" className="mt-7 inline-block rounded-lg bg-boreal-gold px-6 py-3.5 font-semibold">See all products</Link></div></main>;
  const related = industries.filter((i) => p.inds.some((n) => i.name.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(i.name.toLowerCase())));
  return <>
    <SEO title={`${p.name} | Boreal Financial`} description={p.def} />
    <main className="bg-white font-sans text-boreal-ink">
      <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]"><div className="mx-auto max-w-[820px] px-6 py-16 md:py-24">
        <Link href="/products" className={`${eyebrow} hover:underline`}>{p.tag}</Link>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-5xl">{p.name}</h1>
        <p className="mt-5 text-lg leading-relaxed text-[#c3cfe0]">{p.def}</p><p className="mt-3 text-[16px] leading-relaxed text-boreal-muted">{p.sub}</p>
        <div className="mt-8 flex flex-wrap gap-3.5"><a href={applyHref} onClick={() => trackConversion("apply_click", { where: `product_${p.slug}` })} className="rounded-lg bg-boreal-gold px-6 py-3.5 text-[15px] font-semibold text-boreal-ink hover:bg-[#cfa953]">Apply now</a><Link href="/contact" className="rounded-lg border border-white/20 bg-white/10 px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-white/[0.16]">Talk to us</Link></div>
      </div></section>
      <div className="mx-auto max-w-[1000px] space-y-6 px-6 py-16 md:py-24">
        <section className={card}><div className={eyebrow}>How it works</div><h2 className={h2}>How it works</h2><ol className="mt-5 grid gap-4 md:grid-cols-2">{p.how.map(([t,d],i) => <li key={t} className="rounded-xl border border-boreal-line bg-boreal-mist p-5"><div className="font-display text-sm font-bold text-boreal-gold">Step {i+1}</div><div className="mt-1 font-display text-[18px] font-bold">{t}</div><p className="mt-1.5 text-[15px] leading-relaxed text-boreal-body">{d}</p></li>)}</ol></section>
        <section className={card}><div className={eyebrow}>At a glance</div><h2 className={h2}>At a glance</h2><dl className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">{([["Typical amount",p.amount],["Speed to funds",p.speed],["Term",p.term],["Cost basis",p.cost]] as const).map(([k,v]) => <div key={k} className="rounded-xl border border-boreal-line bg-boreal-mist p-5"><dt className="text-[11.5px] uppercase tracking-wide text-boreal-body">{k}</dt><dd className="mt-1.5 text-[15px] font-semibold">{v}</dd></div>)}</dl></section>
        <section className={card}><div className={eyebrow}>Fit</div><h2 className={h2}>Is it right for you?</h2><div className="mt-5 grid gap-8 md:grid-cols-2"><Fit title="Good fit if…" items={p.best} good /><Fit title="Not ideal if…" items={p.notIdeal} /></div></section>
        <section className={card}><div className={eyebrow}>Example</div><h2 className={h2}>A real-world example</h2><p className="mt-4 text-[16px] leading-relaxed text-boreal-body">{p.example}</p></section>
        <section className={card}><div className={eyebrow}>Cost</div><h2 className={h2}>What drives your cost</h2><p className="mt-3 text-[15px] leading-relaxed text-boreal-body">Rates vary by amount, product and business, so any figure quoted here would mislead. Three things move it most:</p><ul className="mt-4 space-y-2.5">{p.drivers.map(x => <li key={x} className="flex gap-2.5 text-[15px] text-boreal-body"><span className="text-boreal-gold">•</span>{x}</li>)}</ul>{SHOW_RANGES ? <p>{p.range}</p> : null}<a href={applyHref} onClick={() => trackConversion("apply_click", { where: `product_cost_${p.slug}` })} className="mt-7 inline-block rounded-lg bg-boreal-gold px-6 py-3.5 text-[15px] font-semibold">See what you qualify for</a></section>
        <section className={card}><div className={eyebrow}>FAQ</div><h2 className={h2}>Questions people ask</h2><div className="mt-5 space-y-3">{p.faqs.map(([q,a]) => <details key={q} className="rounded-xl border border-boreal-line bg-boreal-mist px-6 py-5"><summary className="cursor-pointer font-display text-[18px] font-bold">{q}</summary><p className="mt-3 text-[15px] leading-relaxed text-boreal-body">{a}</p></details>)}</div></section>
        {related.length ? <section className={card}><div className={eyebrow}>Industries</div><h2 className={h2}>Used most in</h2><div className="mt-5 flex flex-wrap gap-2.5">{related.map(i => <Link key={i.slug} href={`/industries/${i.slug}`} className="rounded-lg border border-boreal-line px-4 py-2.5 text-[14px] font-semibold hover:border-boreal-gold">{i.title}</Link>)}</div></section> : null}
        <section className={card}><div className={eyebrow}>More products</div><h2 className={h2}>Other ways to fund it</h2><div className="mt-5 flex flex-wrap gap-2.5">{PRODUCT_CONTENT.filter(x => x.slug !== p.slug).map(x => <Link key={x.slug} href={`/products/${x.slug}`} className="rounded-lg border border-boreal-line px-4 py-2.5 text-[14px] font-semibold hover:border-boreal-gold">{x.name}</Link>)}</div></section>
      </div>
    </main>
  </>;
}

function Fit({ title, items, good = false }: { title: string; items: string[]; good?: boolean }) {
  const color = good ? "text-[#2f9e5b]" : "text-[#b91c1c]";
  return <div><div className={`font-display text-[17px] font-bold ${color}`}>{title}</div><ul className="mt-3 space-y-2.5">{items.map(x => <li key={x} className="flex gap-2.5 text-[15px] leading-relaxed text-boreal-body"><span aria-hidden="true" className={color}>{good ? "✓" : "–"}</span><span>{x}</span></li>)}</ul></div>;
}
