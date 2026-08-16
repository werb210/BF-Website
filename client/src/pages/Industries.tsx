// BF_WEBSITE_INDUSTRIES_v4
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { APPLY_URL } from "@/config/site";
import { industries } from "@/data/industries";
import { trackConversion } from "@/main";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";

export default function Industries() {
  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());

  return (
    <>
      <SEO
        title="Business Financing By Industry | Canada | Boreal Financial"
        description="Financing built around how your industry actually runs - progress draws, seasonal swings, fleet purchases, patient receivables. One application, 80+ Canadian lenders."
      />
      <main className="bg-white font-sans text-boreal-ink">
        <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
          <div className="mx-auto max-w-[820px] px-6 py-16 md:py-24">
            <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">We know how your industry pays</h1>
            <p className="mt-5 text-lg leading-relaxed text-[#c3cfe0]">Cash problems aren&rsquo;t generic. A contractor waits on holdbacks. A restaurant lives on a six-week peak. A trucking company&rsquo;s money is parked in fuel and equipment before a single invoice goes out.</p>
            <p className="mt-4 text-lg leading-relaxed text-[#c3cfe0]">Lenders differ too &mdash; most have industries they understand and industries they avoid. Part of what we do is know which is which, so your file goes to the ones who&rsquo;ll actually read it.</p>
          </div>
        </section>
        <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <Link key={industry.slug} href={`/industries/${industry.slug}`} className="group rounded-2xl border border-boreal-line bg-white p-7 transition hover:border-boreal-gold hover:shadow-[0_12px_30px_rgba(11,31,58,0.08)]">
                <h2 className="font-display text-[22px] font-bold text-boreal-ink">{industry.title}</h2>
                <p className="mt-2.5 text-[15px] leading-relaxed text-boreal-body">{industry.summary}</p>
                <div className="mt-4 border-t border-boreal-line pt-4 text-[13.5px] font-semibold text-boreal-gold">See what fits <span className="ml-2 transition group-hover:ml-3" aria-hidden="true">&rarr;</span></div>
              </Link>
            ))}
          </div>
        </section>
        <section className="border-t border-boreal-line bg-boreal-mist">
          <div className="mx-auto max-w-[820px] px-6 py-14 text-center">
            <h2 className="font-display text-2xl font-bold">Don&rsquo;t see your industry?</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-boreal-body">These are the sectors we see most, not the only ones we fund. Apply and we&rsquo;ll tell you what you qualify for.</p>
            <a href={applyHref} onClick={() => trackConversion("apply_click", { where: "industries_footer" })} className="mt-7 inline-block rounded-lg bg-boreal-gold px-6 py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:bg-[#cfa953]">Apply now</a>
          </div>
        </section>
      </main>
    </>
  );
}
