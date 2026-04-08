import { industries } from "@/data/marketplace";

export function IndustryCards() {
  return (
    <section className="py-14 bg-muted/30" aria-labelledby="industry-cards-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="industry-cards-title" className="text-2xl font-semibold text-secondary">Industries we support</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <article key={industry.slug} className="rounded-lg border bg-background p-5">
              <h3 className="font-semibold">{industry.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{industry.description}</p>
              <a className="inline-block text-primary text-sm font-medium mt-3" href={`/industries/${industry.slug}`}>
                Explore {industry.name}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
