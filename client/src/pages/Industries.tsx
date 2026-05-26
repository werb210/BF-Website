import { Link } from "wouter";
import { industries } from "@/data/industries";

// BF_WEBSITE_BLOCK_v153_MOBILE_FIRST_LAUNCH_v1 — removed the top
// "selector pill" grid. The page now opens directly to the industry
// cards which is what Todd wants users to see on mobile (88% of
// traffic). Previously users had to scroll past 12 pills before
// seeing the first industry card.
export default function Industries() {
  return (
    <section className="mx-auto max-w-7xl bg-[#020817] px-5 py-10 text-white md:px-6 md:py-12">
      <h1 className="text-3xl font-bold md:text-5xl">Industries We Advise</h1>
      <p className="mt-3 text-sm text-slate-300 md:text-base">
        Tailored capital structures across the sectors we know best.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {industries.map((industry) => (
          <Link
            key={industry.slug}
            href={`/industries/${industry.slug}`}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-[#08132a]"
          >
            <img
              src={industry.image}
              className="h-32 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-52"
              alt={industry.name}
              width={1200}
              height={520}
              loading="lazy"
              decoding="async"
            />
            <div className="p-3 sm:p-4">
              <h3 className="text-base font-semibold sm:text-xl">{industry.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{industry.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
