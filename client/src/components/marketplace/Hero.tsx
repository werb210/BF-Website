import { APPLY_URL } from "@/config/site";

export function Hero() {
  return (
    <section
      className="hero relative py-16 text-white md:py-20"
      style={{
        backgroundImage: "url('/images/16x9 Concierge Private Banking Hero Image.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="container hero-inner relative">
        <div className="hero-left grid gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Boreal Marketplace</p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">One application. Multiple lender offers.</h1>
          <p className="max-w-2xl text-base text-slate-200 md:text-lg">
            Boreal is a marketplace built for business owners who want options fast. Apply once and compare offers side-by-side with no lender-to-lender back-and-forth.
          </p>
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-5">
            <a href={APPLY_URL} className="rounded-md bg-white px-5 py-3 text-center font-semibold text-slate-900">Apply Now</a>
            <a href="#how-it-works" className="text-sm font-semibold text-white underline underline-offset-4">How it works</a>
          </div>
        </div>

        <div className="hero-right flex items-end justify-start md:justify-end">
          <p className="text-sm text-slate-300">Canada first. U.S. supported.</p>
        </div>
      </div>
    </section>
  );
}
