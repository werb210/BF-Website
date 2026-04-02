import { APPLY_URL } from "@/config/links";

type Props = {
  title: string;
  description: string;
  bestFor: string[];
  howItWorks: string[];
};

export default function ProductTemplate({
  title,
  description,
  bestFor,
  howItWorks,
}: Props) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-6 text-4xl font-semibold">{title}</h1>
        <p className="mb-12 text-lg text-gray-600">{description}</p>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Best For</h2>
          <ul className="ml-5 list-disc space-y-2 text-gray-700">
            {bestFor.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 text-xl font-semibold">How It Works</h2>
          <ul className="ml-5 list-disc space-y-2 text-gray-700">
            {howItWorks.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-xl font-semibold">How We Structure Your File</h2>
          <div className="grid gap-4 text-center md:grid-cols-5">
            <div>
              <p className="font-semibold">1. Apply</p>
              <a href={APPLY_URL} className="text-sm text-blue-600 underline">
                Apply Now
              </a>
            </div>
            <div><p>2. AI Structuring</p></div>
            <div><p>3. Lender Packaging</p></div>
            <div><p>4. Offers</p></div>
            <div><p>5. Funding</p></div>
          </div>
        </section>

        <div className="text-center">
          <a href={APPLY_URL} className="rounded-md bg-blue-600 px-6 py-3 text-white">
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}
