import { Link } from "react-router-dom";

const highlights = ["Construction", "Manufacturing", "Logistics", "And more B2B sectors"];

export function IndustryCards() {
  return (
    <section className="bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-semibold">Industries</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">Different businesses have different cycles. Explore common scenarios and product fit by industry.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          {highlights.map((item) => (
            <article key={item} className="rounded-lg border bg-white p-3 text-sm font-medium">{item}</article>
          ))}
        </div>
        <Link href="/industries" className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">Explore industries</Link>
      </div>
    </section>
  );
}
