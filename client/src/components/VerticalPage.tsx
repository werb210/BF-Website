import { Link } from "wouter";
import { useEffect } from "react";
import { scrollToTop } from "@/utils/scrollToTop";
import { APPLY_URL } from "@/config/links";

type Solution = {
  name: string;
  when: string;
  minimum: string;
  size: string;
};

type VerticalPageProps = {
  title: string;
  headline: string;
  subheadline: string;
  image: string;
  solutions: Solution[];
};

export function VerticalPage({ title, headline, subheadline, image, solutions }: VerticalPageProps) {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-slate-900">{headline}</h1>
          <p className="mt-5 text-lg text-slate-600">{subheadline}</p>
          <div className="mt-8 flex gap-3">
            <a href={APPLY_URL} className="rounded-lg bg-slate-900 px-6 py-3 text-white">Apply Now</a>
            <Link href="/contact" className="rounded-lg border border-slate-300 px-6 py-3">Speak With Advisor</Link>
          </div>
        </div>
        <img src={image} alt={title} width={1200} height={860} className="h-[430px] w-full rounded-2xl object-cover shadow-xl" loading="lazy" decoding="async" />
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl font-semibold text-slate-900">AI-Driven Capital Structuring</h2>
          <p className="mt-4 text-lg text-slate-600">Boreal’s AI underwriting engine analyzes banking trends, contract structures, and capital stack positioning to match your profile to lender criteria before submission — increasing approval probability and reducing structuring friction.</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 rounded-2xl border border-slate-200 bg-white p-8">
            {['Intake', 'AI Packaging', 'Lender Match', 'Structured Offer'].map((step) => (
              <div key={step} className="rounded-lg bg-slate-50 p-4 text-center font-semibold text-slate-700">{step}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <h2 className="text-4xl font-semibold text-slate-900">Capital Solutions</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {solutions.map((solution) => (
            <article key={solution.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">{solution.name}</h3>
              <p className="mt-4 text-sm text-slate-600"><strong>When it works:</strong> {solution.when}</p>
              <p className="mt-2 text-sm text-slate-600"><strong>Minimum requirements:</strong> {solution.minimum}</p>
              <p className="mt-2 text-sm text-slate-600"><strong>Ideal deal size:</strong> {solution.size}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-4xl font-semibold text-slate-900">How We Structure Your File</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {['Diagnostic + Data Collection', 'AI Risk Modeling', 'Curated Lender Presentation'].map((step, i) => (
              <div key={step} className="rounded-xl border border-slate-200 p-6">
                <p className="text-sm font-semibold text-slate-500">Step {i + 1}</p>
                <p className="mt-2 text-lg font-medium text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-4xl font-semibold text-slate-900">40+ Capital Providers</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">Provider {i + 1}</div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#0f1f36] text-center text-white">
        <h2 className="text-4xl font-semibold">Capital clarity. Structured execution.</h2>
        <a href={APPLY_URL} className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900">Apply Now</a>
      </section>
    </main>
  );
}
