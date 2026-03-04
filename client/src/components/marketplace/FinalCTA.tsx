import { APPLY_URL } from "@/config/site";

export function FinalCTA() {
  return (
    <section className="section section-light">
      <div className="container cta-container">
        <div className="rounded-xl bg-slate-900 p-7 text-white">
          <h2 className="text-2xl font-semibold">Ready to compare lender offers?</h2>
          <p className="mt-2 text-slate-200">Submit once and review options in one place.</p>
          <a href={APPLY_URL} className="mt-5 inline-block rounded-md bg-white px-5 py-3 font-semibold text-slate-900">Apply Now</a>
        </div>
      </div>
    </section>
  );
}
