import { Seo } from "@/components/SEO";
import NotFound from "@/pages/NotFound";
import { COMPARISON_BY_SLUG } from "@/data/seoFramework";
import { getEnv } from "@/config/env";

const BASE_URL = getEnv().VITE_SITE_URL;

interface ComparisonTemplateProps {
  params: {
    slug: string;
  };
}

export default function ComparisonTemplate({ params }: ComparisonTemplateProps) {
  const comparison = COMPARISON_BY_SLUG.get(params.slug);

  if (!comparison) {
    return <NotFound />;
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which option is usually easier to qualify for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Qualification depends on documentation quality, stability of cash flow, and whether the funding structure matches the business purpose."
        }
      },
      {
        "@type": "Question",
        name: "Is lower headline cost always better?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not always. The best structure balances speed, flexibility, risk transfer, and total effective cost over the life of the facility."
        }
      }
    ]
  };

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <Seo
        title={`${comparison.title} | Boreal Financial`}
        description={`Professional comparison framework for ${comparison.title.toLowerCase()}, covering structure, approvals, costs, and best-fit use cases.`}
        canonical={`${BASE_URL}/compare/${comparison.slug}`}
        jsonLd={faqSchema}
      />

      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Comparison Guide</p>
        <h1 className="text-4xl font-bold text-slate-900">{comparison.title}</h1>
      </header>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Quick Summary Table</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-800">
              <tr>
                <th className="p-3">Dimension</th>
                <th className="p-3">Option A</th>
                <th className="p-3">Option B</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-t"><td className="p-3">Speed</td><td className="p-3">Moderate</td><td className="p-3">Fast to moderate</td></tr>
              <tr className="border-t"><td className="p-3">Documentation</td><td className="p-3">Comprehensive</td><td className="p-3">Targeted</td></tr>
              <tr className="border-t"><td className="p-3">Flexibility</td><td className="p-3">Program-dependent</td><td className="p-3">Structure-dependent</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">How Each Option Works</h2><p>Both structures address liquidity but differ in underwriting emphasis, repayment mechanics, and covenant expectations. A side-by-side fit analysis should be tied to operating realities, not only advertised rates.</p></section>
      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">Approval Differences</h2><p>Approval speed and certainty depend on lender policy depth, financial transparency, and whether use of funds is short-cycle operational support or longer-term capital deployment.</p></section>
      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">Cost Comparison</h2><p>Evaluate headline rate, setup charges, ongoing fees, and prepayment implications to compare total effective cost with realistic utilization assumptions.</p></section>
      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">Risk Comparison</h2><p>Risk profile differs by collateral treatment, concentration exposure, and cash-flow sensitivity under downside revenue scenarios.</p></section>
      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">Who Each Option Is Best For</h2><p>Option fit should reflect reporting maturity, capital planning horizon, and tolerance for structure complexity over time.</p></section>
      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">Final Recommendation</h2><p>Prioritize the structure that sustains operating resilience and strategic flexibility, even if it is not the superficially cheapest path on day one.</p></section>

      <section className="rounded-2xl bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-semibold">Need help choosing the right structure?</h2>
        <p className="mt-2 text-slate-200">Get an objective fit assessment based on your current cash cycle, growth plans, and documentation readiness.</p>
      </section>
    </main>
  );
}
