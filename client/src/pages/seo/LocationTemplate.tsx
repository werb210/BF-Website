import { Link } from "wouter";
import { Seo } from "@/components/SEO";
import NotFound from "@/pages/NotFound";
import { LOCATION_BY_SLUG, PRODUCT_BY_SLUG } from "@/data/seoFramework";
import { SITE_URL } from "@/config/links";

const BASE_URL = SITE_URL;

interface LocationTemplateProps {
  params: {
    product: string;
    location: string;
  };
}

export default function LocationTemplate({ params }: LocationTemplateProps) {
  const product = PRODUCT_BY_SLUG.get(params.product);
  const location = LOCATION_BY_SLUG.get(params.location);

  if (!product || !location) {
    return <NotFound />;
  }

  const title = `${product.name} in ${location.name}, ${location.province}`;
  const description = `Local guidance for ${product.name.toLowerCase()} in ${location.name}, including funding ranges, timelines, and provincial considerations.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `Boreal Financial ${title}`,
    areaServed: {
      "@type": "City",
      name: location.name
    },
    serviceType: product.name,
    url: `${BASE_URL}/products/${product.slug}/${location.slug}`
  };

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <Seo
        title={`${title} | Boreal Financial`}
        description={description}
        canonical={`${BASE_URL}/products/${product.slug}/${location.slug}`}
        jsonLd={schema}
      />

      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Location Guide</p>
        <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
      </header>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Local Market Context</h2>
        <p>{location.name}'s business ecosystem combines established mid-market operators and growth-oriented firms, creating consistent demand for fast, adaptable financing structures tied to contract cycles and seasonal cash requirements.</p>
      </section>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Common Industries in {location.name}</h2>
        <p>Borrowers in {location.name} frequently operate across construction, logistics, hospitality, and light manufacturing, with capital needs often linked to labor scheduling, inventory timing, and equipment readiness.</p>
      </section>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">How Funding Works in {location.province}</h2>
        <p>Funding assessments in {location.province} typically emphasize cash-flow resilience, tax compliance posture, and documentation quality. Clear use-of-funds and realistic repayment pacing improve confidence from underwriting teams.</p>
      </section>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Typical Funding Ranges</h2>
        <p>Most approved files range from $50,000 to $750,000, with limits driven by revenue trajectory, transaction history, and the specific risk profile of the funding purpose.</p>
      </section>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Approval Timeline</h2>
        <p>Preliminary direction can be provided in one to two business days. Full approvals and funding are often completed within three to seven business days for complete files.</p>
      </section>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Case Study Snippet</h2>
        <p>A {location.name}-based operator used {product.name.toLowerCase()} to bridge a supplier-payment gap during a high-demand cycle, preserving delivery timelines and avoiding margin erosion from delayed purchasing.</p>
      </section>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">FAQ</h2>
        <p><strong>Do local businesses need collateral?</strong> Not always. Structure depends on cash flow, business profile, and lender program fit.</p>
        <p><strong>Can businesses with uneven seasonality qualify?</strong> Yes, if the file demonstrates a clear operating cycle and repayment capacity through the year.</p>
      </section>

      <section className="rounded-2xl bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-semibold">Need {product.name.toLowerCase()} in {location.name}?</h2>
        <p className="mt-2 text-slate-200">Share your goals and recent financials to get a practical funding roadmap tailored to local market realities.</p>
        <Link href={`/products/${product.slug}`} className="mt-4 inline-block rounded-md bg-white px-4 py-2 font-semibold text-slate-900">
          Review Product Overview
        </Link>
      </section>
    </main>
  );
}
