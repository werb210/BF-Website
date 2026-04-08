import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ApplyNowButton, AskQuestionButton } from "@/components/cta-buttons";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/SEO";
import { organizationJsonLd } from "@/lib/structured-data";

const products = [
  {
    name: "Term Loans",
    slug: "/term-loans",
    title: "Structured capital for larger projects",
    details: "Longer-term financing built around project schedules, expansion plans, or refinancing needs."
  },
  {
    name: "Lines of Credit",
    slug: "/lines-of-credit",
    title: "Flexible access to working capital",
    details: "Draw and repay as you go to cover payroll, materials, and seasonal swings."
  },
  {
    name: "Factoring",
    slug: "/factoring",
    title: "Unlock cash tied up in receivables",
    details: "Convert invoices into funding when customers pay on long terms."
  },
  {
    name: "Purchase Order Financing",
    slug: "/purchase-order-financing",
    title: "Fulfill large orders without cash strain",
    details: "Finance supplier costs to accept bigger contracts and larger POs."
  },
  {
    name: "Equipment Financing",
    slug: "/equipment-financing",
    title: "Grow fleets and machinery with speed",
    details: "Acquire, replace, or upgrade equipment without draining operating cash."
  }
];

export default function FundingSolutions() {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Funding Solutions | Boreal Financial" description="Explore Boreal Financial funding solutions, including term loans, lines of credit, factoring, and purchase order financing." canonical="https://borealfinancial.ca/funding-solutions" jsonLd={organizationJsonLd} />
      <Navigation />

      <main>
        <section className="bg-muted/40 border-b border-border py-12 lg:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Products</p>
            <h1 className="text-3xl lg:text-4xl font-semibold text-secondary">Marketplace-backed financing, structured for your business</h1>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto">
              Boreal matches your deal to lenders who know your industry. Explore the products below, or apply now to start structuring a custom funding plan.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <ApplyNowButton />
              <AskQuestionButton variant="outline" />
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.name} className="h-full border-border shadow-sm">
                  <CardContent className="p-5 space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{product.name}</p>
                      <h3 className="text-lg font-semibold text-secondary">{product.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{product.details}</p>
                    <a
                      href={product.slug}
                      className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                    >
                      View details
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <ApplyNowButton />
              <AskQuestionButton variant="outline" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
