import { Link } from "react-router-dom";
import { products } from "@/data/products";

export default function Products() {
  return (
    <div className="bg-[#020817] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Products</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">Products Available</h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {products.map((product) => (
            <article key={product.slug} className="rounded-3xl bg-[#0a1731] p-6 ring-1 ring-white/10 md:p-8">
              <img src={product.image} alt={product.name} width={1200} height={640} className="h-64 w-full rounded-2xl object-cover" loading="lazy" decoding="async" />
              <div>
                <h2 className="mt-4 text-3xl font-bold">{product.name}</h2>
                <p className="mt-3 text-slate-300">{product.description}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-200">
                  <p><span className="font-semibold text-white">What it is:</span> {product.whatItDoes}</p>
                  <p><span className="font-semibold text-white">Best use case:</span> {product.bestUse}</p>
                  <p><span className="font-semibold text-white">Term range:</span> {product.term}</p>
                  <p><span className="font-semibold text-white">Rate range:</span> {product.rateRange}</p>
                  <p><span className="font-semibold text-white">Why it&apos;s useful:</span> {product.goodFit[0]}</p>
                </div>
                <Link href={`/products/${product.slug}`} className="mt-6 inline-block w-full rounded bg-white px-4 py-2 text-center text-black md:w-auto">
                  Learn More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
