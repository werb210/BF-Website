import { industries } from "@/data/industries";
import { useParams } from "wouter";

export default function IndustryPage() {
  const params = useParams();
  const slug = params?.slug ?? "";
  const industry = industries.find((item) => item.slug === slug);

  if (!industry) {
    return <div className="bg-black px-6 py-16 text-white">Industry not found.</div>;
  }

  return (
    <section className="bg-black py-20 text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <div>
          <h1 className="mb-6 text-4xl font-bold">Financing Solutions for {industry.name}</h1>
          <p className="text-lg leading-relaxed text-gray-300">
            Businesses in {industry.name} face liquidity pressure, growth constraints, and capital access complexity.
            Boreal builds financing strategies aligned to industry-specific operating cycles.
          </p>
        </div>

        <img src={industry.image} className="rounded shadow-xl" alt={industry.name} width={1200} height={675} loading="lazy" decoding="async" />
      </div>
    </section>
  );
}
