import { Seo } from "@/components/SEO";
import { SEOFAQ } from "@/components/SEOFAQ";
import { getLocationFaqs } from "@/data/faqs";
import { getEnv } from "@/config/env";

const BASE_URL = getEnv().VITE_SITE_URL;

export default function WorkingCapitalEdmontonLocationPage() {
  const faqs = getLocationFaqs("Working Capital Loans", "Edmonton");
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Boreal Financial",
    url: BASE_URL,
    logo: BASE_URL + "/images/300_300.png"
  };

  const financialServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Boreal Financial",
    serviceType: "Working Capital Loans",
    areaServed: "Canada",
    description: "Find working capital loans in Edmonton with lender options aligned to local business needs, eligibility, and repayment preferences.",
    url: BASE_URL + "/products/working-capital/edmonton"
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Seo
        title="Working Capital Loans in Edmonton | Boreal Financial"
        description="Find working capital loans in Edmonton with lender options aligned to local business needs, eligibility, and repayment preferences."
        canonical={BASE_URL + "/products/working-capital/edmonton"}
        jsonLd={[organizationJsonLd, financialServiceJsonLd]}
      />

      <h1 className="text-4xl font-bold text-primary mb-4">Working Capital Loans in Edmonton</h1>
      <p className="text-lg text-slate-700 mb-6">Boreal Financial helps businesses in Edmonton compare working capital loans offers with transparent guidance and practical timelines.</p>

      <section className="space-y-4 text-slate-700">
        <p>
          This page is part of Boreal Financial&apos;s scalable SEO framework. Use this section as
          a structured content scaffold to expand with product specifics, qualification guidelines,
          expected timelines, and rate considerations for working capital loans.
        </p>
        <p>
          Include market-aware details, trust indicators, underwriting context, and value propositions
          tailored to the target search intent. Keep content naturally readable while covering the key
          user questions that drive conversions for commercial finance topics.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-3">Related Working Capital Loans Resources</h2>
        <p className="mb-3">
          Start with the main product overview: <a className="text-blue-700 underline" href="/products/working-capital">Working Capital Loans</a>.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Locations</h3>
            <ul className="space-y-1">
            <li><a className="text-blue-700 underline" href="/products/working-capital/toronto">Toronto</a></li>
            <li><a className="text-blue-700 underline" href="/products/working-capital/calgary">Calgary</a></li>
            <li><a className="text-blue-700 underline" href="/products/working-capital/vancouver">Vancouver</a></li>
            <li><a className="text-blue-700 underline" href="/products/working-capital/edmonton">Edmonton</a></li>
            <li><a className="text-blue-700 underline" href="/products/working-capital/ottawa">Ottawa</a></li>
            <li><a className="text-blue-700 underline" href="/products/working-capital/montreal">Montreal</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Industries</h3>
            <ul className="space-y-1">
            <li><a className="text-blue-700 underline" href="/products/working-capital/industry/construction">Construction</a></li>
            <li><a className="text-blue-700 underline" href="/products/working-capital/industry/manufacturing">Manufacturing</a></li>
            <li><a className="text-blue-700 underline" href="/products/working-capital/industry/transportation">Transportation</a></li>
            <li><a className="text-blue-700 underline" href="/products/working-capital/industry/hospitality">Hospitality</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Intent Paths</h3>
            <ul className="space-y-1">
            <li><a className="text-blue-700 underline" href="/products/working-capital/intent/fast-approval">Fast Approval</a></li>
            <li><a className="text-blue-700 underline" href="/products/working-capital/intent/no-collateral">No Collateral</a></li>
            <li><a className="text-blue-700 underline" href="/products/working-capital/intent/poor-credit-friendly">Poor Credit Friendly</a></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-10 bg-slate-50 rounded-lg p-6 border">
        <h2 className="text-2xl font-semibold mb-2">Get a tailored quote</h2>
        <p className="mb-3">Talk to Boreal Financial specialists to compare lender options and structure a competitive offer.</p>
        <a href="/contact" className="inline-block px-4 py-2 bg-primary text-white rounded-md">Request Funding Options</a>
      </section>

      <SEOFAQ faqs={faqs} title="Working Capital Loans FAQs" />
    </main>
  );
}
