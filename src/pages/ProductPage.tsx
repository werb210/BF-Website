import { products } from "@/data/products";
import { useParams } from "wouter";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug ?? "";
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return <div className="min-h-screen bg-black px-6 py-16 text-white">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-black pb-16 pt-24 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <img src={product.image} alt={product.name} width={1200} height={675} className="mb-8 w-full rounded" loading="lazy" decoding="async" />

        <h1 className="mb-6 text-4xl font-bold">{product.name}</h1>

        <p className="mb-6 text-lg text-gray-300">{product.description}</p>

        <ul className="space-y-2 text-gray-300">
          <li>
            <strong>Term:</strong> {product.term}
          </li>
          <li>
            <strong>Rates:</strong> {product.rateRange}
          </li>
          <li>
            <strong>Best For:</strong> {product.bestUse}
          </li>
        </ul>
      </div>
    </div>
  );
}
