import { Seo } from "@/components/SEO";
import { SEOFAQ } from "@/components/SEOFAQ";
import { getIntentFaqs } from "@/data/faqs";
import { SITE_URL } from "@/config/links";

const BASE_URL = SITE_URL;

export default function EquipmentFinancingFastApprovalIntentPage() {
  const faqs = getIntentFaqs("Equipment Financing", "fast approval");
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
    serviceType: "Equipment Financing",
    areaServed: "Canada",
    description: "Review equipment financing options for businesses prioritizing fast approval, with clear expectations for qualification and funding timelines.",
    url: BASE_URL + "/products/equipment-financing/intent/fast-approval"
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Seo
        title="Equipment Financing - Fast Approval | Boreal Financial"
        description="Review equipment financing options for businesses prioritizing fast approval, with clear expectations for qualification and funding timelines."
        canonical={BASE_URL + "/products/equipment-financing/intent/fast-approval"}
        jsonLd={[organizationJsonLd, financialServiceJsonLd]}
      />

      <h1 className="text-4xl font-bold text-primary mb-4">Equipment Financing with Fast Approval</h1>
      <p className="text-lg text-slate-700 mb-6">If your priority is fast approval, this page outlines how equipment financing solutions can be structured to meet your financing goals.</p>

      <section className="space-y-4 text-slate-700">
        <p>
          This page is part of Boreal Financial&apos;s scalable SEO framework. Use this section as
          a structured content scaffold to expand with product specifics, qualification guidelines,
          expected timelines, and rate considerations for equipment financing.
        </p>
        <p>
          Include market-aware details, trust indicators, underwriting context, and value propositions
          tailored to the target search intent. Keep content naturally readable while covering the key
          user questions that drive conversions for commercial finance topics.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-3">Related Equipment Financing Resources</h2>
        <p className="mb-3">
          Start with the main product overview: <a className="text-blue-700 underline" href="/products/equipment-financing">Equipment Financing</a>.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Locations</h3>
            <ul className="space-y-1">
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/toronto">Toronto</a></li>
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/calgary">Calgary</a></li>
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/vancouver">Vancouver</a></li>
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/edmonton">Edmonton</a></li>
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/ottawa">Ottawa</a></li>
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/montreal">Montreal</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Industries</h3>
            <ul className="space-y-1">
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/industry/construction">Construction</a></li>
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/industry/manufacturing">Manufacturing</a></li>
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/industry/transportation">Transportation</a></li>
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/industry/hospitality">Hospitality</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Intent Paths</h3>
            <ul className="space-y-1">
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/intent/fast-approval">Fast Approval</a></li>
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/intent/no-collateral">No Collateral</a></li>
            <li><a className="text-blue-700 underline" href="/products/equipment-financing/intent/poor-credit-friendly">Poor Credit Friendly</a></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-10 bg-slate-50 rounded-lg p-6 border">
        <h2 className="text-2xl font-semibold mb-2">Get a tailored quote</h2>
        <p className="mb-3">Talk to Boreal Financial specialists to compare lender options and structure a competitive offer.</p>
        <a href="/contact" className="inline-block px-4 py-2 bg-primary text-white rounded-md">Request Funding Options</a>
      </section>

      <SEOFAQ faqs={faqs} title="Equipment Financing FAQs" />
    </main>
  );
}
