// BF_WEBSITE_FINISH_v11
// Internal diagnostic, not a marketing page. Kept minimal and noindexed - it
// was previously indexable and exposed nothing useful to a visitor.
import SEO from "@/components/SEO";

export default function SystemStatus() {
  return (
    <>
      <SEO
        title="System Status | Boreal Financial"
        description="Build and environment diagnostics."
        noindex
      />
      <main className="bg-white font-sans text-boreal-ink">
        <div className="mx-auto max-w-[820px] px-6 py-16">
          <h1 className="font-display text-3xl font-bold">System status</h1>
          <dl className="mt-6 space-y-3">
            {([
              ["Environment", import.meta.env.MODE],
              ["Rendered at", new Date().toISOString()],
            ] as const).map(([k, v]) => (
              <div
                key={k}
                className="flex flex-wrap gap-x-4 rounded-xl border border-boreal-line bg-boreal-mist px-6 py-4"
              >
                <dt className="text-[13px] font-semibold uppercase tracking-wide text-boreal-body">
                  {k}
                </dt>
                <dd className="text-[15px] text-boreal-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </main>
    </>
  );
}
