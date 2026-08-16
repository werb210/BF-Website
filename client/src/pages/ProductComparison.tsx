// BF_WEBSITE_COMPARE_v7
// The comparison table is driven from PRODUCT_CONTENT so it stays aligned with
// the individual product pages. Serves both /compare and /product-comparison.
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { PRODUCT_CONTENT } from "@/data/productContent";
import { APPLY_URL } from "@/config/site";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";
import { trackConversion } from "@/main";

// Collateral is not a ProductContent field, but it is a key comparison point.
const COLLATERAL: Record<string, string> = {
  loc: "Unsecured, or against receivables",
  "term-loan": "Sometimes secured",
  "equipment-financing": "The equipment itself",
  factoring: "Your receivables",
  "merchant-cash-advance": "Typically unsecured",
  "po-financing": "The purchase order",
  "asset-based-lending": "Receivables, inventory, equipment",
  "media-financing": "Contracts and receivables",
  "sale-leaseback": "The equipment being sold",
  "commercial-real-estate": "The property",
  sba: "Varies; personal guarantee usual",
};

export default function ProductComparison() {
  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());

  return (
    <>
      <SEO
        title="Compare Business Financing Options | Boreal Financial"
        description="Term loans, lines of credit, factoring, equipment finance and more, side by side - amount, speed, term, cost basis and collateral."
        canonical="https://www.boreal.financial/compare"
      />
      <main className="bg-white font-sans text-boreal-ink">
        <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
          <div className="mx-auto max-w-[820px] px-6 py-16 md:py-24">
            <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              Compare your options
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#c3cfe0]">
              The same money can be delivered several ways, and the right one depends on whether
              your need is one-off or recurring, how fast you need it, and what you can put behind
              it.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#c3cfe0]">
              Rates aren&rsquo;t here because they vary by amount, product and business &mdash; any
              number would mislead. Everything else that actually differs is.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <div className="overflow-x-auto rounded-2xl border border-boreal-line">
            <table className="w-full min-w-[900px] text-left text-[14.5px]">
              <thead>
                <tr className="border-b border-boreal-line bg-boreal-mist text-[11.5px] uppercase tracking-wide text-boreal-body">
                  {["Product", "Typical amount", "Speed", "Term", "Cost basis", "Collateral", "Best for"].map(
                    (heading) => (
                      <th key={heading} className="px-5 py-4 font-semibold">
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {PRODUCT_CONTENT.map((product) => (
                  <tr key={product.slug} className="border-b border-boreal-line align-top last:border-0">
                    <td className="px-5 py-4">
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-display text-[16px] font-bold text-boreal-ink hover:text-boreal-goldDeep"
                      >
                        {product.name}
                      </Link>
                      <div className="mt-0.5 text-[12.5px] text-boreal-body">{product.tag}</div>
                    </td>
                    <td className="px-5 py-4 text-boreal-body">{product.amount}</td>
                    <td className="px-5 py-4 text-boreal-body">{product.speed}</td>
                    <td className="px-5 py-4 text-boreal-body">{product.term}</td>
                    <td className="px-5 py-4 text-boreal-body">{product.cost}</td>
                    <td className="px-5 py-4 text-boreal-body">{COLLATERAL[product.slug] ?? "\u2014"}</td>
                    <td className="px-5 py-4 text-boreal-body">{product.best[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-[14px] leading-relaxed text-boreal-body">
            Amounts and timings are typical, not guaranteed. What you qualify for depends on your
            revenue, trading history, industry and what the money is for.
          </p>
        </section>

        <section className="border-y border-boreal-line bg-boreal-mist">
          <div className="mx-auto max-w-[820px] px-6 py-14 text-center">
            <h2 className="font-display text-2xl font-bold">Still not sure which fits?</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-boreal-body">
              That&rsquo;s the normal answer, and it&rsquo;s what we&rsquo;re for. Apply once and
              we&rsquo;ll tell you what you qualify for and where the trade-offs are.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3.5">
              <a
                href={applyHref}
                onClick={() => trackConversion("apply_click", { where: "compare_footer" })}
                className="rounded-lg bg-boreal-gold px-6 py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:bg-[#cfa953]"
              >
                Apply now
              </a>
              <Link
                href="/credit-readiness"
                className="rounded-lg border border-boreal-line bg-white px-6 py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:border-boreal-gold"
              >
                See what I could qualify for
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
