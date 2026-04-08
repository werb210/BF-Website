import { SEO } from "@/seo/SEO";

export default function Terms() {
  return (
    <main className="legal mx-auto max-w-3xl px-4 py-12 text-white">
      <SEO
        title="Terms of Use"
        description="Read Boreal Financial's Terms of Use for access, acceptable use, and limitations related to this website."
        url="https://borealfinancial.ca/terms"
      />
      <h1 className="text-4xl font-semibold">Terms of Use</h1>
      <p className="mt-4 text-white/80">
        By using this website, you agree to Boreal Financial&apos;s terms governing access and use of
        the information provided.
      </p>
    </main>
  );
}
