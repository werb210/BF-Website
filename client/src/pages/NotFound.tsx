// BF_WEBSITE_SWA_FALLBACK_v13
// The not-found page is the one page you cannot control the traffic to, so it
// should look like the rest of the site and offer a way onward rather than a
// bare heading and a link.
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found | Boreal Financial"
        description="That page does not exist. Here is where to go instead."
        noindex
      />
      <main className="bg-white font-sans text-boreal-ink">
        <div className="mx-auto max-w-[820px] px-6 py-24 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-boreal-gold">
            404
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold">We can&rsquo;t find that page</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-boreal-body">
            It may have moved, or the link may be wrong. Here&rsquo;s where most people are headed.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {([
              ["Home", "/"],
              ["Financing products", "/products"],
              ["How it works", "/how-it-works"],
              ["See what you qualify for", "/credit-readiness"],
              ["Contact us", "/contact"],
            ] as const).map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg border border-boreal-line px-5 py-3 text-[15px] font-semibold transition hover:border-boreal-gold"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
