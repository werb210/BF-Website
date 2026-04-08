import { SEO } from "@/seo/SEO";

export default function Privacy() {
  return (
    <main className="legal mx-auto max-w-3xl px-4 py-12 text-white">
      <SEO
        title="Privacy Policy"
        description="Review Boreal Financial's Privacy Policy covering how we collect, use, and protect your information."
        url="https://borealfinancial.ca/privacy"
      />
      <h1 className="text-4xl font-semibold">Privacy Policy</h1>
      <p className="mt-4 text-white/80">
        Boreal Financial respects your privacy and protects all information submitted through this
        website.
      </p>
    </main>
  );
}
