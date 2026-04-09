import { Link } from "react-router-dom";

export default function IndustryCard({ industry }: { industry: string }) {
  return (
    <Link href={`/industries/${industry.toLowerCase()}`} className="group">
      <div className="overflow-hidden rounded bg-neutral-900 shadow-lg transition hover:shadow-2xl">
        <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #0a0f1c, #1c2a4a)", borderRadius: "8px" }} />
        <div className="p-6">
          <h2 className="mb-2 text-xl font-semibold">{industry}</h2>
          <p className="text-sm text-neutral-400">
            Strategic capital solutions designed for {industry.toLowerCase()} businesses.
          </p>
        </div>
      </div>
    </Link>
  );
}
