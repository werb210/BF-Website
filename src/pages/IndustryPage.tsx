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

        <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #0a0f1c, #1c2a4a)", borderRadius: "8px" }} />
      </div>
    </section>
  );
}
