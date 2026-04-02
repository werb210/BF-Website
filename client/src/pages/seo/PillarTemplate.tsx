import type { ReactNode } from "react";
import { Link } from "wouter";
import { Seo } from "@/components/SEO";
import NotFound from "@/pages/NotFound";
import { getEnv } from "@/config/env";
import {
  COMPARISONS,
  INDUSTRIES,
  LOCATIONS,
  PRODUCT_BY_SLUG,
  type SlugNameItem
} from "@/data/seoFramework";

const BASE_URL = getEnv().VITE_SITE_URL;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="space-y-3 text-slate-700">{children}</div>
    </section>
  );
}

function LinkList({ title, items, pathBuilder }: { title: string; items: SlugNameItem[]; pathBuilder: (slug: string) => string }) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <ul className="list-disc space-y-1 pl-5 text-blue-700">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={pathBuilder(item.slug)}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface PillarTemplateProps {
  params: {
    product: string;
  };
}

export default function PillarTemplate({ params }: PillarTemplateProps) {
  const product = PRODUCT_BY_SLUG.get(params.product);

  if (!product) {
    return <NotFound />;
  }

  const faqSchema = [
    {
      "@type": "Question",
      name: `How quickly can ${product.name.toLowerCase()} be approved?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most files can be assessed within 24 to 72 hours once complete financial documentation is submitted."
      }
    },
    {
      "@type": "Question",
      name: "Can newer businesses still qualify?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Lenders often review owner experience, contracts in place, and cash-flow potential in addition to time in business."
      }
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `Boreal Financial ${product.name}`,
    areaServed: "Canada",
    serviceType: product.name,
    url: `${BASE_URL}/products/${product.slug}`,
    mainEntity: faqSchema
  };

  const description = `${product.name} solutions for Canadian businesses with practical approval guidance, eligibility expectations, and strategic use cases.`;

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <Seo
        title={`${product.name} in Canada | Boreal Financial`}
        description={description}
        canonical={`${BASE_URL}/products/${product.slug}`}
        jsonLd={schema}
      />

      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">Pillar Guide</p>
        <h1 className="text-4xl font-bold text-slate-900">{product.name} in Canada</h1>
        <p className="text-lg text-slate-700">A structured decision guide to help owners and finance teams evaluate fit, timing, and lender expectations.</p>
      </header>

      <Section title="Executive Overview">
        <p>{product.name} gives Canadian operators a practical way to fund growth initiatives and short-term cash-flow needs without waiting through prolonged conventional underwriting cycles.</p>
        <p>The strongest applications connect requested capital to a measurable operating objective, such as project mobilization, inventory positioning, equipment deployment, or payroll continuity during receivable delays.</p>
        <p>Rather than presenting financing as a one-time transaction, leading businesses position it as part of an operating plan with defined outcomes, conservative repayment assumptions, and contingency planning.</p>
        <p>When prepared correctly, this approach helps borrowers secure terms that support growth while protecting working liquidity and preserving flexibility for future opportunities.</p>
      </Section>

      <Section title="How It Works">
        <p>Funding requests are typically scoped around purpose, amount, expected return, and repayment profile. Underwriters then assess business revenue quality, sector dynamics, and management depth.</p>
      </Section>

      <Section title="Who It’s For">
        <p>Best suited for small and mid-market Canadian businesses with active revenue, identifiable capital needs, and a management team able to demonstrate how the funding supports near-term performance.</p>
      </Section>

      <Section title="Typical Approval Criteria">
        <ul className="list-disc space-y-1 pl-5">
          <li>Stable recent revenue history and bank activity.</li>
          <li>Clear use-of-funds narrative with realistic repayment assumptions.</li>
          <li>Management capability and sector-specific execution track record.</li>
        </ul>
      </Section>

      <Section title="Required Documentation">
        <ul className="list-disc space-y-1 pl-5">
          <li>Recent business bank statements and interim financials.</li>
          <li>Government business registration and ownership structure.</li>
          <li>A/R and A/P aging, plus contract or purchase-order support where relevant.</li>
        </ul>
      </Section>

      <Section title="Advantages vs Traditional Banks">
        <p>Alternative structures can move faster, weigh current operating momentum more heavily, and offer tailored terms where traditional bank policy may be rigid.</p>
      </Section>

      <Section title="Real-World Use Cases">
        <ul className="list-disc space-y-1 pl-5">
          <li>Bridge payroll and supplier obligations during delayed receivable cycles.</li>
          <li>Capture seasonal purchasing opportunities at favorable unit costs.</li>
          <li>Support expansion into additional contracts, routes, or production capacity.</li>
        </ul>
      </Section>

      <Section title="FAQ">
        <div className="space-y-2">
          <p><strong>How fast can funding close?</strong> Turnaround can be as quick as several business days for complete, straightforward files.</p>
          <p><strong>Are collateral-light options available?</strong> Yes, depending on cash-flow strength and lender policy.</p>
        </div>
      </Section>

      <Section title="Explore Related Pages">
        <div className="grid gap-4 md:grid-cols-3">
          <LinkList title="Location Pages" items={LOCATIONS} pathBuilder={(locationSlug) => `/products/${product.slug}/${locationSlug}`} />
          <LinkList title="Industry Pages" items={INDUSTRIES} pathBuilder={(industrySlug) => `/industry/${industrySlug}/${product.slug}`} />
          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-lg font-semibold text-slate-900">Comparison Pages</h3>
            <ul className="list-disc space-y-1 pl-5 text-blue-700">
              {COMPARISONS.map((comparison) => (
                <li key={comparison.slug}>
                  <Link href={`/compare/${comparison.slug}`}>{comparison.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <section className="rounded-2xl bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-semibold">Ready to structure {product.name.toLowerCase()} strategically?</h2>
        <p className="mt-2 text-slate-200">Book a financing review to assess options, likely timelines, and the documentation package that improves approval confidence.</p>
        <Link href="/contact" className="mt-4 inline-block rounded-md bg-white px-4 py-2 font-semibold text-slate-900">
          Speak with a Funding Specialist
        </Link>
      </section>
    </main>
  );
}
