// BF_WEBSITE_PRODUCT_PAGES_v1 - product detail page rebuilt to the approved
// mockup structure: hero, how it works, at a glance, fit, example, apply &
// cost (drivers only - Option B, no illustrative ranges until figures are
// confirmed; flip SHOW_RANGES to publish them), FAQ, related industries.
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { productContentBySlug, PRODUCT_CONTENT } from "@/data/productContent";
import { industries } from "@/data/industries";

const SHOW_RANGES = false;

const slugAliases: Record<string, string> = {
  "line-of-credit": "loc",
  "lines-of-credit": "loc",
  "term-loans": "term-loan",
  "purchase-order-financing": "po-financing",
  "invoice-factoring": "factoring",
};

type ProductDetailProps = { slug: string };

const card = "rounded-2xl border border-white/10 bg-[#08132a] p-6";
const seclabel = "text-[11px] font-bold uppercase tracking-[0.14em] text-sky-400/80";
const h3 = "mt-2 text-2xl font-bold text-white";

export default function ProductDetail({ slug }: ProductDetailProps) {
  const resolvedSlug = slugAliases[slug] ?? slug;
  const p = productContentBySlug(resolvedSlug);

  if (!p) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center text-white">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <p className="mt-3 text-white/70">The financing product you are looking for does not exist.</p>
        <Link href="/products" className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold">All products</Link>
      </main>
    );
  }

  const pageTitle = `${p.name} | Boreal Financial`;
  const relatedIndustries = industries.filter((i) => p.inds.some((n) => i.name.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(i.name.toLowerCase()))).slice(0, 6);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 text-white">
      <SEO title={pageTitle} description={p.def} url={`https://borealfinancial.ca/products/${slug}`} />
      <section className="mb-10">
        <div className={seclabel}>{p.tag}</div>
        <h1 className="mt-2 text-4xl font-extrabold">{p.name}</h1>
        <p className="mt-4 max-w-3xl text-lg text-white/80">{p.def}</p>
        <p className="mt-2 max-w-3xl text-white/60">{p.sub}</p>
        <div className="mt-6 flex flex-wrap gap-3"><Link href="/apply" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">Apply now</Link><Link href="/contact" className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/5">Talk to us</Link></div>
      </section>
      <section className={`${card} mb-6`}><div className={seclabel}>{p.name} - How it works</div><h2 className={h3}>How it works</h2><ol className="mt-4 grid gap-4 md:grid-cols-3">{p.how.map(([t, d], i) => (<li key={t} className="rounded-xl border border-white/10 bg-[#0b1830] p-4"><div className="text-sm font-bold text-sky-400">Step {i + 1}</div><div className="mt-1 font-semibold">{t}</div><p className="mt-1 text-sm text-white/70">{d}</p></li>))}</ol></section>
      <section className={`${card} mb-6`}><div className={seclabel}>{p.name} - At a glance</div><h2 className={h3}>At a glance</h2><dl className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">{[["Typical amount", p.amount], ["Speed to funds", p.speed], ["Term", p.term], ["Cost basis", p.cost]].map(([k, v]) => (<div key={k} className="rounded-xl border border-white/10 bg-[#0b1830] p-4"><dt className="text-xs uppercase tracking-wide text-white/50">{k}</dt><dd className="mt-1 text-sm font-semibold">{v}</dd></div>))}</dl></section>
      <section className={`${card} mb-6`}><div className={seclabel}>{p.name} - Fit</div><h2 className={h3}>Is it right for you?</h2><div className="mt-4 grid gap-6 md:grid-cols-2"><div><div className="font-semibold text-emerald-400">Good fit if...</div><ul className="mt-2 space-y-2 text-sm text-white/75">{p.best.map((x) => <li key={x} className="flex gap-2"><span className="text-emerald-400">+</span><span>{x}</span></li>)}</ul></div><div><div className="font-semibold text-rose-400">Not ideal if...</div><ul className="mt-2 space-y-2 text-sm text-white/75">{p.notIdeal.map((x) => <li key={x} className="flex gap-2"><span className="text-rose-400">-</span><span>{x}</span></li>)}</ul></div></div></section>
      <section className={`${card} mb-6`}><div className={seclabel}>{p.name} - Example</div><h2 className={h3}>A real-world example</h2><p className="mt-3 max-w-3xl text-white/80">{p.example}</p></section>
      <section className={`${card} mb-6`}><div className={seclabel}>{p.name} - Apply &amp; cost</div><h2 className={h3}>What drives your cost</h2><p className="mt-2 text-white/70">Three things move it most:</p><ul className="mt-3 space-y-2 text-sm text-white/75">{p.drivers.map((x) => <li key={x} className="flex gap-2"><span className="text-sky-400">-</span><span>{x}</span></li>)}</ul>{SHOW_RANGES && (<p className="mt-4 rounded-xl border border-amber-400/40 bg-amber-400/5 p-3 text-sm text-amber-200">{p.range}</p>)}<div className="mt-6 flex flex-wrap gap-3"><Link href="/apply" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">Start your application</Link></div></section>
      <section className={`${card} mb-6`}><div className={seclabel}>{p.name} - FAQ</div><h2 className={h3}>Questions people ask</h2><div className="mt-4 space-y-4">{p.faqs.map(([q, a]) => (<div key={q} className="rounded-xl border border-white/10 bg-[#0b1830] p-4"><div className="font-semibold">{q}</div><p className="mt-1 text-sm text-white/70">{a}</p></div>))}</div></section>
      <section className={`${card} mb-6`}><div className={seclabel}>{p.name} - Related industries</div><h2 className={h3}>Used most in</h2><div className="mt-4 flex flex-wrap gap-2">{p.inds.map((name) => { const match = relatedIndustries.find((i) => i.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(i.name.toLowerCase())); return match ? <Link key={name} href={`/industries/${match.slug}`} className="rounded-full border border-white/15 px-4 py-1.5 text-sm hover:bg-white/5">{name}</Link> : <span key={name} className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-white/60">{name}</span>; })}</div></section>
      <section className="mt-10"><div className={seclabel}>More products</div><div className="mt-3 flex flex-wrap gap-2">{PRODUCT_CONTENT.filter((x) => x.slug !== p.slug).map((x) => (<Link key={x.slug} href={`/products/${x.slug}`} className="rounded-full border border-white/15 px-4 py-1.5 text-sm hover:bg-white/5">{x.name}</Link>))}</div></section>
    </main>
  );
}
