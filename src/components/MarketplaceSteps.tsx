const steps = [
  {
    title: "Submit once",
    description: "Complete one secure intake and share your deal profile with Boreal.",
  },
  {
    title: "Get lender responses",
    description: "We distribute to fit-matched lenders that serve your geography and industry.",
  },
  {
    title: "Compare structured options",
    description: "Review terms, timing, and collateral expectations in one organized process.",
  },
];

export function MarketplaceSteps() {
  return (
    <section className="py-14" aria-labelledby="marketplace-steps-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="marketplace-steps-title" className="text-2xl font-semibold text-secondary">How the marketplace works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-lg border p-5 bg-card">
              <p className="text-xs font-semibold text-primary uppercase">Step {index + 1}</p>
              <h3 className="mt-2 font-semibold text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
