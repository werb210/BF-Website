import { APPLY_URL } from "@/config/links";

export function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 md:py-16 lg:px-8">
        <div>
          <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #0a0f1c, #1c2a4a)", borderRadius: "8px" }} />
          <h2 className="text-lg font-semibold">Boreal Financial</h2>
          <p className="mt-2 text-sm text-slate-400">
            Structured lending marketplace helping businesses across Canada and the United States.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><a href="/how-it-works">How It Works</a></li>
            <li><a href="/products/term-loans">Products</a></li>
            <li><a href="/industries/construction">Industries</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Apply Now</h3>
          <div className="mt-3 flex flex-col gap-3">
            <a
              href={APPLY_URL}
              className="inline-flex w-fit items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Apply Now
            </a>
            <a
              href="/credit-readiness"
              className="inline-flex w-fit items-center justify-center rounded-lg border border-blue-400/70 px-5 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-500/10"
            >
              Check your Credit Readiness
            </a>
          </div>
          <ul className="mt-5 space-y-2 text-sm text-slate-300">
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/capital-readiness-score">Capital Readiness Score</a></li>
            <li><a href="/product-comparison">Product Comparison</a></li>
            <li><a href="/staff-login">Staff Login</a></li>
            <li><a href="/lender-login">Lender Login</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
