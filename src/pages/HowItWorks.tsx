import { SEO } from "@/seo/SEO";

const flow = [
  "Submit one smart intake",
  "Boreal standardizes and packages your file",
  "Multiple lenders review and provide offers",
  "You compare transparent terms and choose",
  "Funding and onboarding",
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <SEO title="How It Works | Boreal Marketplace" description="Understand Boreal's structured lending marketplace process from intake to funding." />
      <h1 className="text-3xl font-bold">How Boreal's marketplace works</h1>
      <p className="mt-3 text-slate-600">Boreal is a single intake marketplace. You submit once and we route your file to matching lenders.</p>
      <ol className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
        {flow.map((item, index) => (
          <li key={item} className="rounded-lg border p-4">
            <h2 className="font-semibold">Step {index + 1}</h2>
            <p className="text-sm text-slate-600">{item}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
