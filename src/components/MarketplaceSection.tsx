import { Link } from "react-router-dom";
export default function MarketplaceSection() {
  return (
    <section className="bg-primary py-12 text-white">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <section className="px-6 py-12">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold">A Marketplace for Capital</h2>
              <p className="text-gray-400">
                Access multiple lenders through one structured submission. We position your file correctly from the start.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
              <ul className="space-y-3 text-gray-400">
                <li>1. Complete your credit readiness check</li>
                <li>2. Get matched with the right capital</li>
                <li>3. Submit once, reach multiple lenders</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="mt-3 border-t border-white/20 pt-3">
          <h3 className="text-3xl font-semibold text-white">Why This Matters</h3>
          <div className="mt-4 grid gap-4 text-base text-slate-200 md:grid-cols-2">
            <div>
              <p className="font-semibold text-white">Traditional financing relies on:</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>One bank</li>
                <li>One credit committee</li>
                <li>One decision</li>
                <li>One set of terms</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white">Our model creates:</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>Multiple funding sources</li>
                <li>Competitive leverage</li>
                <li>Structured positioning</li>
                <li>Faster decision timelines</li>
                <li>Greater capital flexibility</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-base text-slate-200">You gain leverage. You gain visibility. You gain optionality.</p>
        </div>

        <section className="py-12 text-center">
          <h3 className="mb-4 text-2xl font-semibold">Would you like to see if you are ready for financing?</h3>
          <Link
            href="/credit-readiness"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
          >
            Check Your Credit Readiness
          </Link>
        </section>
      </div>
    </section>
  );
}
