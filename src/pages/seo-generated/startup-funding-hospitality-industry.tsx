import { Seo } from "@/components/SEO";
import { SEOFAQ } from "@/components/SEOFAQ";
import { getIndustryFaqs } from "@/data/faqs";
import { SITE_URL } from "@/config/links";

const BASE_URL = SITE_URL;

export default function StartupFundingHospitalityIndustryPage() {
  const faqs = getIndustryFaqs("Startup Business Funding", "hospitality");
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Boreal Financial",
    url: BASE_URL,
    logo: BASE_URL + ""
  };

  const financialServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Boreal Financial",
    serviceType: "Startup Business Funding",
    areaServed: "Canada",
    description: "Learn how startup business funding supports hospitality businesses with financing structures designed for operational realities and growth goals.",
    url: BASE_URL + "/products/startup-funding/industry/hospitality"
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Seo
        title="Startup Business Funding for Hospitality | Boreal Financial"
        description="Learn how startup business funding supports hospitality businesses with financing structures designed for operational realities and growth goals."
        canonical={BASE_URL + "/products/startup-funding/industry/hospitality"}
        jsonLd={[organizationJsonLd, financialServiceJsonLd]}
      />

      <h1 className="text-4xl font-bold text-primary mb-4">Startup Business Funding for Hospitality Businesses</h1>
      <p className="text-lg text-slate-700 mb-6">Compare startup business funding programs built for hospitality operators seeking predictable repayment and working-capital resilience.</p>

      <section className="space-y-4 text-slate-700">
        <p>
          This page is part of Boreal Financial&apos;s scalable SEO framework. Use this section as
          a structured content scaffold to expand with product specifics, qualification guidelines,
          expected timelines, and rate considerations for startup business funding.
        </p>
        <p>
          Include market-aware details, trust indicators, underwriting context, and value propositions
          tailored to the target search intent. Keep content naturally readable while covering the key
          user questions that drive conversions for commercial finance topics.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-3">Related Startup Business Funding Resources</h2>
        <p className="mb-3">
          Start with the main product overview: <a className="text-blue-700 underline" href="/products/startup-funding">Startup Business Funding</a>.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Locations</h3>
            <ul className="space-y-1">
            <li><a className="text-blue-700 underline" href="/products/startup-funding/toronto">Toronto</a></li>
            <li><a className="text-blue-700 underline" href="/products/startup-funding/calgary">Calgary</a></li>
            <li><a className="text-blue-700 underline" href="/products/startup-funding/vancouver">Vancouver</a></li>
            <li><a className="text-blue-700 underline" href="/products/startup-funding/edmonton">Edmonton</a></li>
            <li><a className="text-blue-700 underline" href="/products/startup-funding/ottawa">Ottawa</a></li>
            <li><a className="text-blue-700 underline" href="/products/startup-funding/montreal">Montreal</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Industries</h3>
            <ul className="space-y-1">
            <li><a className="text-blue-700 underline" href="/products/startup-funding/industry/construction">Construction</a></li>
            <li><a className="text-blue-700 underline" href="/products/startup-funding/industry/manufacturing">Manufacturing</a></li>
            <li><a className="text-blue-700 underline" href="/products/startup-funding/industry/transportation">Transportation</a></li>
            <li><a className="text-blue-700 underline" href="/products/startup-funding/industry/hospitality">Hospitality</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Intent Paths</h3>
            <ul className="space-y-1">
            <li><a className="text-blue-700 underline" href="/products/startup-funding/intent/fast-approval">Fast Approval</a></li>
            <li><a className="text-blue-700 underline" href="/products/startup-funding/intent/no-collateral">No Collateral</a></li>
            <li><a className="text-blue-700 underline" href="/products/startup-funding/intent/poor-credit-friendly">Poor Credit Friendly</a></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-10 bg-slate-50 rounded-lg p-6 border">
        <h2 className="text-2xl font-semibold mb-2">Get a tailored quote</h2>
        <p className="mb-3">Talk to Boreal Financial specialists to compare lender options and structure a competitive offer.</p>
        <a href="/contact" className="inline-block px-4 py-2 bg-primary text-white rounded-md">Request Funding Options</a>
      </section>

      <SEOFAQ faqs={faqs} title="Startup Business Funding FAQs" />
    </main>
  );
}
