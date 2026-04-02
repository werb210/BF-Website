import { Link } from "wouter";
import { APPLY_URL } from "@/config/links";

const products = [
  { label: "Line of Credit", href: "/products/loc" },
  { label: "Term Loan", href: "/products/term-loan" },
  { label: "Equipment Financing", href: "/products/equipment-financing" },
  { label: "Factoring", href: "/products/factoring" },
  { label: "PO Financing", href: "/products/po-financing" },
  { label: "Asset Based Lending", href: "/products/asset-based-lending" },
];

export function ProductGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="text-right">
          <a href={APPLY_URL} className="text-sm font-semibold underline underline-offset-4">Apply Now</a>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.label} className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">{product.label}</h3>
            <Link href={product.href} className="mt-2 inline-block text-sm text-slate-700 underline underline-offset-4">Learn More</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
