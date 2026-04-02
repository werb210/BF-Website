import { Link, useRoute } from "wouter";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { LOCATIONS, PRODUCTS } from "@/data/seoLandingConfig";
import { SEO } from "@/seo/SEO";
import NotFound from "@/pages/NotFound";
import { APPLY_URL } from "@/config/links";

function normalizeSlug(input: string): string {
  return input.trim().toLowerCase();
}

export default function SeoLandingPage() {
  const [matched, params] = useRoute<{ productSlug: string; location: string }>("/:productSlug/:location");

  if (!matched || !params) {
    return <NotFound />;
  }

  const product = PRODUCTS.find((item) => item.slug === normalizeSlug(params.productSlug));
  const location = LOCATIONS.find((item) => item.toLowerCase() === normalizeSlug(params.location));

  if (!product || !location) {
    return <NotFound />;
  }

  const title = `${product.name} in ${location} | Boreal Financial`;
  const description = `Apply for ${product.name} in ${location}. Fast approvals and flexible funding.`;
  const siteUrl = import.meta.env.VITE_SITE_URL ?? "https://borealfinancial.ca";
  const canonical = `${siteUrl}/${product.slug}/${location.toLowerCase()}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Boreal Financial",
    areaServed: location,
    serviceType: product.name
  };

  const relatedLocations = LOCATIONS.filter((value) => value !== location);
  const relatedProducts = PRODUCTS.filter((value) => value.slug !== product.slug);

  return (
    <div className="min-h-screen bg-background">
      <SEO title={title} description={description} url={canonical} schema={jsonLd} />
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-wider font-semibold text-primary">Local financing solutions</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-secondary">{product.name} in {location}</h1>
          <p className="text-lg text-muted-foreground">
            Boreal Financial helps companies secure {product.name.toLowerCase()} in {location} with fast underwriting,
            lender matching, and practical guidance tailored to local operating realities.
          </p>
          <a href={APPLY_URL}>
            <Button size="lg">Apply Now</Button>
          </a>
        </section>

        <section className="prose prose-gray max-w-none text-foreground">
          <p>
            Businesses in {location} face a funding environment that rewards preparation, strong financial reporting,
            and speed. Whether your company is balancing payroll, buying inventory, or preparing for growth,
            access to structured financing can be the difference between maintaining momentum and missing strategic
            opportunities. {product.name} gives businesses access to capital designed for day-to-day flexibility while
            preserving long-term financial health.
          </p>
          <p>
            At Boreal Financial, we work with founders, operators, and finance teams that need funding options aligned
            with their real operating cycle. Many companies in {location} manage irregular inflows tied to customer
            payment terms, project milestones, or seasonal demand. A tailored funding strategy allows leadership teams
            to keep operations steady while confidently planning expansion.
          </p>
          <p>
            Our process starts with a practical review of your objectives. We look at how quickly capital is needed,
            how it will be deployed, and what repayment structure best supports your business model. This approach
            helps ensure your financing supports growth instead of creating avoidable pressure. It also allows us to
            match each file with lenders that understand your sector and local market conditions in {location}.
          </p>
          <p>
            Companies use {product.name.toLowerCase()} for many reasons: stabilizing cash flow during rapid growth,
            funding inventory before major contracts, modernizing equipment, hiring skilled staff, or covering short
            operational gaps. The right facility can also create negotiating power with suppliers and customers by
            allowing your team to move quickly when attractive opportunities appear.
          </p>
          <p>
            Speed matters, but structure matters more. Boreal Financial emphasizes complete submissions, transparent
            documentation requirements, and direct communication throughout underwriting. This reduces back-and-forth,
            improves lender confidence, and shortens the timeline from initial inquiry to funded transaction. Many
            clients can secure approvals quickly when required documentation is available and financials are current.
          </p>
          <p>
            We also support businesses that are not served well by traditional banking channels. If your company is in
            an early growth stage, transitioning ownership, recovering from temporary disruptions, or navigating a
            specialized niche, there are often non-bank and alternative lenders open to strong opportunities. Our team
            helps position these files effectively so decision-makers can evaluate them on the full business context.
          </p>
          <p>
            Local knowledge is an advantage. Funding requirements in {location} can vary by industry concentration,
            contract cycles, and workforce costs. Boreal Financial incorporates these factors when preparing your file,
            so your financing recommendation reflects how your business actually operates in-market. This creates more
            resilient outcomes and improves fit over the life of the facility.
          </p>
          <p>
            Beyond initial funding, we help companies think in stages. The facility you need now may differ from the
            structure you need six to twelve months from today. By planning financing in phases, organizations can
            reduce friction, avoid unnecessary refinancing, and maintain strategic flexibility as revenue scales.
            This long-view mindset is especially valuable for teams managing ambitious growth targets.
          </p>
          <p>
            If you are exploring {product.name.toLowerCase()} in {location}, Boreal Financial can help you prepare a
            lender-ready application and compare options with confidence. We combine responsive service, practical
            guidance, and market access to help businesses secure capital that supports performance today while building
            a stronger financing profile for the future.
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-secondary">Explore this product in other cities</h2>
            <ul className="space-y-2">
              {relatedLocations.map((item) => (
                <li key={item}>
                  <Link href={`/${product.slug}/${item.toLowerCase()}`} className="text-primary hover:underline">
                    {product.name} in {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-secondary">Compare other products in {location}</h2>
            <ul className="space-y-2">
              {relatedProducts.map((item) => (
                <li key={item.slug}>
                  <Link href={`/${item.slug}/${location.toLowerCase()}`} className="text-primary hover:underline">
                    {item.name} in {location}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
