// BF_WEBSITE_BOREAL_PAGES_v3
import SEO from "@/components/SEO";
import { APPLY_URL } from "@/config/site";
import { products } from "@/data/products";
import { trackConversion } from "@/main";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";
import { Link } from "wouter";

const FEATURED = [
  { slug: "term-loan", blurb: "A lump sum with fixed, predictable payments. For expansion, a build-out, an acquisition, or any one-time investment you'd rather not fund from cash flow.", meta: "Fixed schedule" },
  { slug: "loc", blurb: "Draw what you need, pay interest only on what you use, repay and draw again. The usual answer to seasonal swings and slow-paying customers.", meta: "Revolving" },
  { slug: "factoring", blurb: "Get paid now for invoices your customers will settle in 30, 60 or 90 days. Your receivables are the security, so the decision rests on your customers' credit as much as yours.", meta: "Secured by receivables" },
  { slug: "equipment-financing", blurb: "Finance machinery, vehicles or technology, new or used. The equipment secures the loan, which usually means a lower rate than unsecured borrowing.", meta: "New or used" },
  { slug: "asset-based-lending", blurb: "Borrow against inventory, receivables and equipment together. Suits businesses with a strong balance sheet and lumpy earnings.", meta: "Borrowing base" },
  { slug: "sale-leaseback", blurb: "Free up cash tied in equipment you already own. Sell it to the lender, lease it back, keep using it.", meta: "Releases cash" },
  { slug: "commercial-real-estate", blurb: "Purchase, refinance, construction and bridge financing for owner-occupied and investment property.", meta: "Longer timeline" },
  { slug: "sba", blurb: "SBA 7(a) and 504 financing for United States businesses. Longer terms and lower down payments than conventional lending usually offers. There is no Canadian equivalent.", meta: "United States only" },
] as const;

export default function Products() {
  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());
  const cards = FEATURED.flatMap((featured) => {
    const product = products.find(({ slug }) => slug === featured.slug);
    return product ? [{ ...featured, name: product.name }] : [];
  });
  const applyLink = (where: string, label: string) => <a href={applyHref} onClick={() => trackConversion("apply_click", { where })} className="mt-7 inline-block rounded-lg bg-boreal-gold px-6 py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:bg-[#cfa953]">{label}</a>;
  return <><SEO title="Business Financing Products | Term Loans, LOC, Equipment | Boreal Financial" description="Term loans, lines of credit, factoring, equipment finance, asset-based lending, sale and leaseback, commercial real estate and SBA. One application reaches all of them." /><main className="bg-white font-sans text-boreal-ink">
    <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]"><div className="mx-auto max-w-[820px] px-6 py-16 md:py-24"><h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">The right kind of capital for the job</h1><p className="mt-5 text-lg leading-relaxed text-[#c3cfe0]">Different problems need different money. A seasonal cash gap and a building purchase are not the same request, and shouldn&rsquo;t get the same product. Here&rsquo;s what we place, and what each is actually for.</p><p className="mt-4 text-lg leading-relaxed text-[#c3cfe0]">If you&rsquo;re not sure which one fits, don&rsquo;t guess — apply once and we&rsquo;ll tell you what you qualify for.</p>{applyLink("products_hero", "Apply now")}</div></section>
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{cards.map((product) => <Link key={product.slug} href={`/products/${product.slug}`} className="group rounded-2xl border border-boreal-line bg-white p-7 transition hover:border-boreal-gold hover:shadow-[0_12px_30px_rgba(11,31,58,0.08)]"><h2 className="font-display text-[22px] font-bold">{product.name}</h2><p className="mt-2.5 text-[15px] leading-relaxed text-boreal-body">{product.blurb}</p><div className="mt-4 border-t border-boreal-line pt-4 text-[13.5px] font-semibold text-[#33425c]">{product.meta}<span className="ml-2 text-boreal-gold transition group-hover:ml-3" aria-hidden="true">→</span></div></Link>)}</div></section>
    <section className="border-t border-boreal-line bg-boreal-mist"><div className="mx-auto max-w-[820px] px-6 py-14 text-center"><h2 className="font-display text-2xl font-bold">Not sure which one fits?</h2><p className="mt-3 text-[16px] leading-relaxed text-boreal-body">Apply once and we&rsquo;ll tell you what you qualify for. No cost, no obligation, and no impact on your credit.</p>{applyLink("products_footer", "Apply now")}</div></section>
  </main></>;
}
