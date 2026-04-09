import React from "react";
import { AlertTriangle, ArrowRight, BarChart3, CircleDollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { APPLY_URL } from "@/config/links";
import { industries } from "@/data/industries";
import { products } from "@/data/products";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";

type Props = { slug: string };

const challengeIcons = [AlertTriangle, CircleDollarSign, BarChart3, TrendingUp];

export default function IndustryDetail({ slug }: Props) {
  const industry = industries.find((item) => item.slug === slug);
  const industryProducts = products.filter((product) => industry && product.relatedIndustries.includes(industry.name));
  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());

  if (!industry) return <div className="bg-black px-6 py-16 text-white">Industry not found.</div>;

  return (
    <div className="bg-[#020817] text-white">
      <section className="relative overflow-hidden">
        <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #0a0f1c, #1c2a4a)", borderRadius: "8px" }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-20">
          <h1 className="text-4xl font-bold md:text-5xl">{industry.name}</h1>
          <p className="mt-4 max-w-3xl text-base text-slate-200 md:text-lg">{industry.advisory}</p>
          <a href={applyHref} className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 font-semibold text-black">Apply Now</a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
        <h2 className="text-2xl font-bold md:text-3xl">Industry Challenges</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {industry.challenges.map((challenge, index) => {
            const Icon = challengeIcons[index] ?? AlertTriangle;
            return (
              <article key={challenge} className="rounded-2xl border border-white/10 bg-[#08132a] p-4">
                <Icon className="mb-3 text-blue-300" size={18} />
                <p className="text-sm text-slate-200 md:text-base">{challenge}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
        <h2 className="text-2xl font-bold md:text-3xl">How Boreal Solves This</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {industryProducts.map((product) => (
            <article key={product.slug} className="overflow-hidden rounded-2xl border border-white/10 bg-[#08132a]">
              <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #0a0f1c, #1c2a4a)", borderRadius: "8px" }} />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{product.description}</p>
                <p className="mt-2 text-xs text-blue-200">Best for: {product.bestUse}</p>
                <Link href={`/products/${product.slug}`} className="mt-4 inline-flex items-center gap-2 rounded bg-white px-3 py-2 text-xs font-semibold text-black">
                  Learn More <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
        <h2 className="text-2xl font-bold md:text-3xl">Products available</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {industryProducts.map((product) => (
            <Link key={`${industry.slug}-${product.slug}`} href={`/products/${product.slug}`} className="rounded-full border border-white/20 bg-[#08132a] px-4 py-2 text-sm text-slate-200">
              {product.name}
            </Link>
          ))}
        </div>
      </section>



      <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
        <h2 className="text-2xl font-bold md:text-3xl">Timeline</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            "Step 1 — Apply Now",
            "Step 2 — Readiness review",
            "Step 3 — Lender matching",
            "Step 4 — Structured offer",
          ].map((step) => (
            <div key={step} className="rounded-xl border border-white/10 bg-[#08132a] p-4 text-sm text-slate-200">{step}</div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
        <h2 className="text-2xl font-bold md:text-3xl">Mini readiness form</h2>
        <p className="mt-2 text-sm text-slate-300">Start here, then complete full readiness in the next step.</p>
        <form action="/credit-readiness" className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-[#08132a] p-4 md:grid-cols-2">
          <input name="companyName" placeholder="Company Name" required className="rounded border border-white/20 bg-[#050B1A] p-3" />
          <input name="fullName" placeholder="Full Name" required className="rounded border border-white/20 bg-[#050B1A] p-3" />
          <input name="email" type="email" placeholder="Email" required className="rounded border border-white/20 bg-[#050B1A] p-3" />
          <input name="phone" placeholder="Phone" required className="rounded border border-white/20 bg-[#050B1A] p-3" />
          <button className="rounded bg-white px-4 py-3 font-semibold text-black md:col-span-2" type="submit">Continue to Full Readiness</button>
        </form>
      </section>

      <section className="border-y border-white/10 bg-black/40">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 py-8 md:flex-row md:items-center md:px-6">
          <div>
            <h2 className="text-2xl font-bold">Credit readiness for {industry.name}</h2>
            <p className="mt-2 text-slate-300">Complete a quick intake and continue your application with your saved readiness session.</p>
          </div>
          <Link href="/credit-readiness" className="rounded-full bg-white px-6 py-2.5 font-semibold text-black">Start Credit Readiness</Link>
        </div>
      </section>
    </div>
  );
}
