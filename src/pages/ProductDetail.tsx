import React from "react";
import { Link } from "react-router-dom";
import { APPLY_URL } from "@/config/links";
import { industries } from "@/data/industries";
import { products } from "@/data/products";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";
import ProductComparison from "@/components/ProductComparison";
import SEO from "@/components/SEO";
import SeoJsonLd from "@/components/SeoJsonLd";
import { faqSchema, serviceSchema } from "@/seo/structuredData";

type ProductDetailProps = {
  slug: string;
};

const slugAliases: Record<string, string> = {
  "line-of-credit": "loc",
  "lines-of-credit": "loc",
  "term-loans": "term-loan",
  "purchase-order-financing": "po-financing",
  "invoice-factoring": "factoring",
};

export default function ProductDetail({ slug }: ProductDetailProps) {
  const resolvedSlug = slugAliases[slug] ?? slug;
  const product = products.find((item) => item.slug === resolvedSlug);
  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());

  if (!product) {
    return <div className="min-h-screen bg-black px-4 py-12 text-white">Product not found.</div>;
  }

  const relatedIndustries = industries.filter((industry) => product.relatedIndustries.includes(industry.name));
  const isLineOfCredit = resolvedSlug === "loc";
  const isEquipmentFinancing = resolvedSlug === "equipment-financing";
  const isProductPage = true;

  const pageTitle = isLineOfCredit
    ? "Business Line of Credit Canada (Up to $10M) | Boreal Financial"
    : isEquipmentFinancing
      ? "Equipment Financing Canada | Fast Approvals | Boreal Financial"
      : `${product.name} | Boreal Financial`;

  const pageDescription = isLineOfCredit
    ? "Flexible business line of credit solutions for Canadian companies. Access capital when you need it. Same-day approvals available."
    : `${product.description} Boreal Financial supports Canadian businesses with fast, flexible financing options.`;

  const pageH1 = isLineOfCredit ? "Business Line of Credit in Canada" : product.name;

  const breadcrumbSchema = isProductPage
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://borealfinancial.ca",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: product.name,
            item: `https://borealfinancial.ca/products/${slug}`,
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-[#020817] pb-12 pt-10 text-white md:pb-16">
      <SEO title={pageTitle} description={pageDescription} url={`https://borealfinancial.ca/products/${slug}`} />
      {breadcrumbSchema ? <SeoJsonLd data={breadcrumbSchema} /> : null}
      {isLineOfCredit && (
        <>
          <SeoJsonLd
            data={serviceSchema(
              "Business Line of Credit",
              "Flexible working capital financing for Canadian businesses.",
              "/line-of-credit"
            )}
          />
          <SeoJsonLd
            data={faqSchema([
              {
                question: "How fast can I get a business line of credit?",
                answer: "Approvals can occur within 24–72 hours depending on documentation.",
              },
              {
                question: "What credit score is required?",
                answer: "Most lenders require 600+, but alternative options exist.",
              },
            ])}
          />
        </>
      )}
      <section className="mx-auto max-w-7xl px-5 py-4 md:px-6">
        <Link href="/products" className="inline-flex items-center text-sm font-semibold text-blue-200 hover:text-white">← Back to Products</Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-6 md:px-6">
        <div className="rounded-2xl border border-blue-300/30 bg-blue-900/20 p-5 md:p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">Serving Canadian Businesses Nationwide</p>
          <h2 className="mt-2 text-2xl font-bold">Apply in 3 Minutes</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={applyHref} className="inline-block rounded-full bg-white px-6 py-2.5 font-semibold text-black">Start Application</a>
            <Link href="/contact" className="inline-block rounded-full border border-white/50 px-6 py-2.5 font-semibold text-white">Speak to an Advisor</Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img src={product.image} alt={product.name} width={1600} height={900} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-16">
          <h1 className="text-4xl font-bold md:text-5xl">{pageH1}</h1>
          <p className="mt-4 max-w-3xl text-base text-slate-200 md:text-lg">{product.heroSummary}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
        <h2 className="text-2xl font-bold md:text-3xl">{isLineOfCredit ? "How a Business Line of Credit Works" : "What it is"}</h2>
        <p className="mt-4 max-w-4xl text-slate-200">{product.whatItDoes}</p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
        <h2 className="text-2xl font-bold md:text-3xl">{isLineOfCredit ? "Who Qualifies?" : "Who it's for"}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-200">
          {product.goodFit.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
        <h2 className="text-2xl font-bold md:text-3xl">Best use cases</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {product.useCases.map((useCase) => (
            <div key={useCase} className="rounded-xl border border-white/10 bg-[#08132a] p-4 text-sm text-slate-200">
              {useCase}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
        <h2 className="text-2xl font-bold md:text-3xl">{isLineOfCredit ? "Rates & Terms" : "Term and rate structure"}</h2>
        <p className="mt-2 text-sm text-slate-300">Ranges shown are indicative and subject to underwriting.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-[#08132a] p-4"><p className="text-xs uppercase text-blue-200">Typical range</p><p className="mt-2">{product.typicalRange}</p></div>
          <div className="rounded-xl border border-white/10 bg-[#08132a] p-4"><p className="text-xs uppercase text-blue-200">Term range</p><p className="mt-2">{product.term}</p></div>
          <div className="rounded-xl border border-white/10 bg-[#08132a] p-4"><p className="text-xs uppercase text-blue-200">Rate range</p><p className="mt-2">{product.rateRange}</p></div>
          <div className="rounded-xl border border-white/10 bg-[#08132a] p-4"><p className="text-xs uppercase text-blue-200">Repayment</p><p className="mt-2">{product.repayment}</p></div>
          <div className="rounded-xl border border-white/10 bg-[#08132a] p-4"><p className="text-xs uppercase text-blue-200">Collateral</p><p className="mt-2">{product.collateral}</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
        <h2 className="text-2xl font-bold md:text-3xl">Related industries</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relatedIndustries.map((industry) => (
            <Link key={industry.slug} href={`/industries/${industry.slug}`} className="rounded-2xl border border-white/10 bg-[#08132a] p-4 hover:bg-[#0f1d3a]">
              <p className="text-lg font-semibold">{industry.name}</p>
              <p className="mt-2 text-sm text-slate-300">{industry.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {isLineOfCredit ? (
        <>
          <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
            <h2 className="text-2xl font-bold md:text-3xl">Why Choose Boreal Financial?</h2>
            <p className="mt-4 max-w-4xl text-slate-200">We structure flexible revolving facilities for Canadian operators with transparent terms, responsive execution, and lender access built around real operating cycles.</p>
          </section>

          <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
            <h2 className="text-2xl font-bold md:text-3xl">Frequently Asked Questions</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-200">
              <li><Link href="/faq" className="text-blue-300 underline underline-offset-2">View our full FAQ page</Link> for detailed answers on approvals, rates, and documentation.</li>
              <li>Most line-of-credit approvals are returned within 24 to 72 hours once your package is complete.</li>
            </ul>
          </section>

          <section className="mx-auto max-w-7xl px-5 py-10 md:px-6">
            <h2 className="text-2xl font-bold md:text-3xl">Helpful Resources</h2>
            <p className="mt-3 text-slate-200">Explore related pages: <Link href="/" className="text-blue-300 underline underline-offset-2">Homepage</Link>, <Link href="/products/equipment-financing" className="text-blue-300 underline underline-offset-2">Equipment Financing</Link>, and <Link href="/faq" className="text-blue-300 underline underline-offset-2">FAQ</Link>.</p>
          </section>
        </>
      ) : null}

      <ProductComparison />

      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-6 md:pb-12">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center md:p-8">
          <h2 className="text-2xl font-bold">Want to evaluate this structure in detail?</h2>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/credit-readiness" className="inline-block rounded-full border border-white px-6 py-2.5 font-semibold text-white">Check Capital Readiness</Link>
            <a href={applyHref} className="inline-block rounded-full bg-white px-6 py-2.5 font-semibold text-black">Apply Now</a>
          </div>
        </div>
      </section>
    </div>
  );
}
