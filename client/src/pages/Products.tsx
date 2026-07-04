// BF_WEBSITE_PRODUCT_PAGES_v1 - products index rebuilt to the approved mockup:
// intro, full comparison table, and product cards linking to detail pages.
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { PRODUCT_CONTENT } from "@/data/productContent";

const COLLATERAL: Record<string, string> = {
  "loc": "Often unsecured or A/R-backed",
  "term-loan": "Sometimes secured",
  "equipment-financing": "The equipment",
  "factoring": "Your receivables",
  "merchant-cash-advance": "Typically unsecured",
  "po-financing": "The purchase order",
  "asset-based-lending": "A/R, inventory, equipment",
  "media-financing": "Contracts / receivables",
};

export default function Products() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 text-white">
      <SEO title="Business Financing Products | Boreal Financial" description="Compare lines of credit, term loans, equipment financing, factoring, MCAs, PO financing, asset-based lending, and media financing - and find the right fit." url="https://borealfinancial.ca/products" />
      <section className="mb-10"><div className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-400/80">Products</div><h1 className="mt-2 text-4xl font-extrabold">Financing built around how your business actually runs</h1><p className="mt-4 max-w-3xl text-lg text-white/75">Eight ways to fund growth, cash-flow gaps, equipment, and big orders. Compare them side by side, then go deeper on the one that fits.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/apply" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">Apply now</Link><Link href="/contact" className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/5">Talk to us</Link></div></section>
      <section className="mb-12 overflow-x-auto rounded-2xl border border-white/10 bg-[#08132a]"><table className="w-full min-w-[880px] text-left text-sm"><thead><tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/50">{["Product", "Amount", "Speed", "Term", "Cost basis", "Collateral", "Best for"].map((h) => (<th key={h} className="px-4 py-3 font-semibold">{h}</th>))}</tr></thead><tbody>{PRODUCT_CONTENT.map((p) => (<tr key={p.slug} className="border-b border-white/5 align-top hover:bg-white/5"><td className="px-4 py-3"><Link href={`/products/${p.slug}`} className="font-semibold text-sky-300 hover:underline">{p.name}</Link><div className="text-xs text-white/50">{p.tag}</div></td><td className="px-4 py-3 text-white/80">{p.amount}</td><td className="px-4 py-3 text-white/80">{p.speed}</td><td className="px-4 py-3 text-white/80">{p.term}</td><td className="px-4 py-3 text-white/80">{p.cost}</td><td className="px-4 py-3 text-white/80">{COLLATERAL[p.slug] ?? "-"}</td><td className="px-4 py-3 text-white/80">{p.best[0]}</td></tr>))}</tbody></table></section>
      <section className="grid gap-4 md:grid-cols-2">{PRODUCT_CONTENT.map((p) => (<Link key={p.slug} href={`/products/${p.slug}`} className="rounded-2xl border border-white/10 bg-[#08132a] p-6 hover:bg-[#0f1d3a]"><div className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-400/80">{p.tag}</div><div className="mt-2 text-xl font-bold">{p.name}</div><p className="mt-2 text-sm text-white/70">{p.sub}</p><div className="mt-3 text-sm font-semibold text-sky-300">Learn more -&gt;</div></Link>))}</section>
    </main>
  );
}
