import { Link } from "wouter";
import { Seo } from "@/components/SEO";
import NotFound from "@/pages/NotFound";
import { CASE_STUDY_BY_SLUG, PRODUCT_BY_SLUG } from "@/data/seoFramework";
import { getEnv } from "@/config/env";

const BASE_URL = getEnv().VITE_SITE_URL;

interface CaseStudyTemplateProps {
  params: {
    slug: string;
  };
}

export default function CaseStudyTemplate({ params }: CaseStudyTemplateProps) {
  const caseStudy = CASE_STUDY_BY_SLUG.get(params.slug);

  if (!caseStudy) {
    return <NotFound />;
  }

  const product = PRODUCT_BY_SLUG.get(caseStudy.productSlug);

  if (!product) {
    return <NotFound />;
  }

  const amount = caseStudy.amount.toLocaleString("en-CA");
  const title = `${caseStudy.industry} Business Secures $${amount} in ${caseStudy.city}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: `Case study on a ${caseStudy.industry.toLowerCase()} business in ${caseStudy.city} using ${product.name.toLowerCase()} to solve ${caseStudy.challenge}.`,
    author: {
      "@type": "Organization",
      name: "Boreal Financial"
    },
    publisher: {
      "@type": "Organization",
      name: "Boreal Financial"
    },
    datePublished: "2026-01-01",
    mainEntityOfPage: `${BASE_URL}/case-studies/${caseStudy.slug}`
  };

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <Seo
        title={`${title} | Boreal Financial Case Study`}
        description={`How a ${caseStudy.industry.toLowerCase()} company in ${caseStudy.city} structured ${product.name.toLowerCase()} and improved outcomes.`}
        canonical={`${BASE_URL}/case-studies/${caseStudy.slug}`}
        jsonLd={schema}
      />

      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Case Study</p>
        <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
      </header>

      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">Client Overview</h2><p>The client is an established {caseStudy.industry.toLowerCase()} operator in {caseStudy.city}, {caseStudy.province}, with consistent demand but concentrated working-capital pressure during growth periods.</p></section>
      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">Funding Need</h2><p>The company required ${amount} to support a near-term execution window while preserving vendor relationships and operational continuity.</p></section>
      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">Challenges</h2><p>The primary issue was that {caseStudy.challenge}, creating strain between payment obligations and incoming receivables.</p></section>
      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">Solution Structured</h2><p>Boreal Financial structured {product.name.toLowerCase()} aligned with expected cash inflows and near-term operating milestones.</p></section>
      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">Timeline</h2><p>Initial review, underwriting, and funding completed in under one business week once the documentation package was finalized.</p></section>
      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">Outcome</h2><p>As a result, {caseStudy.outcome}.</p></section>
      <section className="space-y-2 text-slate-700"><h2 className="text-2xl font-semibold text-slate-900">Lessons</h2><p>Early documentation planning, explicit capital-use mapping, and conservative repayment assumptions materially improved execution confidence.</p></section>

      <section className="rounded-2xl bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-semibold">Want similar results?</h2>
        <p className="mt-2 text-slate-200">Discuss how we can structure financing around your operating model and timeline priorities.</p>
        <Link href={`/industry/${caseStudy.industrySlug}/${product.slug}`} className="mt-4 inline-block rounded-md bg-white px-4 py-2 font-semibold text-slate-900">
          Explore Industry Funding Guidance
        </Link>
      </section>
    </main>
  );
}
