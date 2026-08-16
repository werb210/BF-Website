// BF_WEBSITE_INDUSTRIES_v4
import { useEffect } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { APPLY_URL } from "@/config/site";
import { industries } from "@/data/industries";
import { trackConversion } from "@/main";
import NotFound from "@/pages/NotFound";
import { scrollToTop } from "@/utils/scrollToTop";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";

export default function IndustryDetail({ slug }: { slug: string }) {
  useEffect(() => scrollToTop(), [slug]);
  const industry = industries.find((item) => item.slug === slug);
  if (!industry) return <NotFound />;
  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());

  return (
    <>
      <SEO title={`${industry.title} Financing Canada | Boreal Financial`} description={industry.description} />
      <main className="bg-white font-sans text-boreal-ink">
        <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
          <div className="mx-auto max-w-[820px] px-6 py-16 md:py-24">
            <Link href="/industries" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-boreal-gold hover:underline">Industries</Link>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-5xl">{industry.title} financing</h1>
            <p className="mt-5 text-lg leading-relaxed text-[#c3cfe0]">{industry.lede}</p>
          </div>
        </section>
        <section className="mx-auto max-w-[820px] px-6 py-16 md:py-24">
          <h2 className="font-display text-2xl font-bold">The problem</h2>
          {industry.problem.map((paragraph) => <p key={paragraph} className="mt-4 text-[16px] leading-relaxed text-boreal-body">{paragraph}</p>)}
          <h2 className="mt-12 font-display text-2xl font-bold">What usually fits</h2>
          <ul className="mt-5 space-y-3">
            {industry.products.map((product) => (
              <li key={product.slug} className="rounded-xl border border-boreal-line bg-boreal-mist px-6 py-5">
                <Link href={`/products/${product.slug}`} className="font-display text-[19px] font-bold text-boreal-ink hover:text-boreal-goldDeep">{product.name}</Link>{" "}
                <span className="text-[16px] leading-relaxed text-boreal-body">{product.note}</span>
              </li>
            ))}
          </ul>
          {industry.worthKnowing && <><h2 className="mt-12 font-display text-2xl font-bold">Worth knowing</h2><p className="mt-4 text-[16px] leading-relaxed text-boreal-body">{industry.worthKnowing}</p></>}
          <h2 className="mt-12 font-display text-2xl font-bold">Have ready</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-boreal-body">{industry.haveReady}</p>
          <a href={applyHref} onClick={() => trackConversion("apply_click", { where: `industry_${industry.slug}` })} className="mt-10 inline-block rounded-lg bg-boreal-gold px-6 py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:bg-[#cfa953]">Apply now</a>
          <p className="mt-3 text-sm text-boreal-body">About five minutes. No cost, no obligation, and no impact on your credit.</p>
        </section>
        <section className="border-t border-boreal-line bg-boreal-mist">
          <div className="mx-auto max-w-[1200px] px-6 py-14">
            <h2 className="font-display text-2xl font-bold">Other industries</h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {industries.filter((item) => item.slug !== industry.slug).map((item) => <Link key={item.slug} href={`/industries/${item.slug}`} className="rounded-full border border-boreal-line bg-white px-4 py-2 text-sm font-semibold text-boreal-body transition hover:border-boreal-gold hover:text-boreal-ink">{item.title}</Link>)}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
