const steps = [
  {
    title: "Assess Eligibility",
    detail: "Complete one smart intake with your business profile and funding goals.",
  },
  {
    title: "Match",
    detail: "Your file is routed across Boreal's marketplace to multiple lenders.",
  },
  {
    title: "Fund",
    detail: "Compare offers, choose the best fit, and move to funding.",
  },
];

export function MarketplaceSteps() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-12 md:py-14">
      <h2 className="text-2xl font-semibold">How the process works</h2>
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-lg border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step {index + 1}</p>
            <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{step.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
