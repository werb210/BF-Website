import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ApplyNowButton, AskQuestionButton } from "@/components/cta-buttons";
import { Seo } from "@/components/SEO";
import { financialServiceJsonLd } from "@/lib/structured-data";

const whoItsFor = [
  "Manufacturers or distributors with confirmed purchase orders",
  "Contractors with large material-intensive jobs",
  "Businesses that need supplier funding before delivery"
];

const useCases = [
  "Pay suppliers for raw materials",
  "Accept larger orders without cash strain",
  "Cover deposits before production begins"
];

const worksWhen = [
  "You have a confirmed PO from a creditworthy buyer",
  "Suppliers require upfront payment",
  "Margins can support financing costs"
];

const notIdealWhen = [
  "Orders are speculative or not fully executed",
  "Margins are too thin",
  "The business lacks reliable supplier documentation"
];

const requiredDocs = [
  "Purchase order and customer information",
  "Supplier quotes or invoices",
  "Bank statements and financials",
  "Fulfillment timeline or contract details"
];

export default function PurchaseOrderFinancing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="Purchase Order Financing | Boreal Financial" description="Purchase order financing to help cover supplier costs and fulfill larger customer orders confidently." canonical="https://borealfinancial.ca/purchase-order-financing" jsonLd={financialServiceJsonLd("Purchase Order Financing", "Finance supplier payments and fulfill large customer orders.", "/purchase-order-financing")} />
      <Navigation />

      <main>
        <section className="bg-gradient-to-br from-blue-50 to-white py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
            <p className="text-sm font-semibold text-primary">Purchase Order Financing</p>
            <h1 className="text-4xl font-bold text-secondary">Fulfill bigger orders without slowing cash flow</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              PO financing covers supplier costs so you can accept large orders and deliver on time.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <ApplyNowButton />
              <AskQuestionButton variant="outline" />
            </div>
          </div>
        </section>

        <section className="py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <Card className="border-blue-100">
              <CardContent className="p-6 space-y-4 text-left">
                <div>
                  <p className="text-sm font-semibold text-primary">Who this is for</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {whoItsFor.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Typical use cases</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {useCases.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-primary">When it works</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {worksWhen.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">When it doesn't</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {notIdealWhen.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">High-level required documents</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {requiredDocs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
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
