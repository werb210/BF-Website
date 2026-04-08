import { APPLY_URL } from "@/config/links";

const useCases = [
  "Film & TV production",
  "Advertising campaigns",
  "Digital media expansion",
  "Revenue-backed streaming advances",
];

const structures = [
  "Revenue-based financing",
  "Contract-backed advances",
  "Production gap financing",
  "Equipment & studio funding",
];

const audiences = [
  "Production companies",
  "Media agencies",
  "Content studios",
  "Independent producers",
];

export default function MediaFinancing() {
  return (
    <main className="bg-[#020817] text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-[#0b1f3a] via-[#08152a] to-[#020817]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Products</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Media Financing</h1>
          <p className="mt-4 max-w-2xl text-slate-200">
            Structured funding for production, digital campaigns, and content-backed revenue.
          </p>
          <a href={APPLY_URL} className="mt-7 inline-flex rounded-full bg-blue-600 px-6 py-2.5 font-semibold text-white">
            Apply Now
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-5 py-12 md:px-6 md:py-14">
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h2 className="text-2xl font-semibold">What It&apos;s Used For</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-200">
            {useCases.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h2 className="text-2xl font-semibold">Structures Available</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-200">
            {structures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h2 className="text-2xl font-semibold">Who It&apos;s For</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-200">
            {audiences.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-blue-300/30 bg-blue-900/30 p-6 text-center">
          <h2 className="text-2xl font-semibold">Ready to structure your media facility?</h2>
          <p className="mt-3 text-slate-200">Talk with our team to align funding terms to your production and receivables cycle.</p>
          <a href={APPLY_URL} className="mt-6 inline-flex rounded-full bg-white px-6 py-2.5 font-semibold text-slate-900">
            Apply Now
          </a>
        </div>
      </section>
    </main>
  );
}
