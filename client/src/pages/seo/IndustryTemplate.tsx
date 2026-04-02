import { Link } from "wouter";
import { Seo } from "@/components/SEO";
import NotFound from "@/pages/NotFound";
import { INDUSTRY_BY_SLUG, PRODUCT_BY_SLUG } from "@/data/seoFramework";
import { SITE_URL } from "@/config/links";

const BASE_URL = SITE_URL;

interface IndustryTemplateProps {
  params: {
    industry: string;
    product: string;
  };
}

export default function IndustryTemplate({ params }: IndustryTemplateProps) {
  const industry = INDUSTRY_BY_SLUG.get(params.industry);
  const product = PRODUCT_BY_SLUG.get(params.product);

  if (!industry || !product) {
    return <NotFound />;
  }

  const title = `${product.name} for ${industry.name} Businesses`;

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <Seo
        title={`${title} | Boreal Financial`}
        description={`Industry-focused guidance on ${product.name.toLowerCase()} for ${industry.name.toLowerCase()} operators across Canada.`}
        canonical={`${BASE_URL}/industry/${industry.slug}/${product.slug}`}
      />

      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Industry Guide</p>
        <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
      </header>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Industry-Specific Challenges</h2>
        <p>{industry.name} businesses often face capital pressure from front-loaded operating costs, variable receivable timing, and the need to preserve delivery continuity during demand swings.</p>
      </section>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Cash Flow Cycles</h2>
        <p>Cash conversion cycles in {industry.name.toLowerCase()} can include periods of concentrated outflow before invoice collection. Funding structures perform best when aligned to contract, seasonality, or production milestones.</p>
      </section>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Risk Factors Lenders Consider</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Revenue concentration by client or contract.</li>
          <li>Margin stability under input-cost volatility.</li>
          <li>Management execution history and reporting quality.</li>
        </ul>
      </section>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Required Documentation</h2>
        <p>Underwriters generally request recent statements, interim financials, tax filings, and industry-specific support such as purchase orders, job schedules, route contracts, or occupancy forecasts.</p>
      </section>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Example Funding Scenario</h2>
        <p>A mid-sized {industry.name.toLowerCase()} operator secures {product.name.toLowerCase()} to pre-fund labor and procurement for a multi-phase engagement, then repays from milestone receivables.</p>
      </section>

      <section className="space-y-2 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Related Case Study</h2>
        <p>Review practical outcomes from Canadian businesses that used structured financing to reduce execution risk and maintain margin discipline.</p>
        <Link href="/case-studies/construction-firm-toronto-250k-working-capital" className="font-semibold text-blue-700">
          Read a representative case study
        </Link>
      </section>

      <section className="rounded-2xl bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-semibold">Discuss your {industry.name.toLowerCase()} funding strategy</h2>
        <p className="mt-2 text-slate-200">We can outline approval expectations, documentation priorities, and structure options aligned with your operating cycle.</p>
      </section>
    </main>
  );
}
