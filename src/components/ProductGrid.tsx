import { products } from "@/data/marketplace";

export function ProductGrid() {
  return (
    <section className="py-14" aria-labelledby="product-grid-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="product-grid-title" className="text-2xl font-semibold text-secondary">Popular financing products</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.slug} className="rounded-lg border p-5 bg-card">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{product.shortDescription}</p>
              <a className="inline-block mt-4 rounded border border-white px-5 py-2 transition hover:bg-white hover:text-black" href={`/products/${product.slug}`}>
                Learn More
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
