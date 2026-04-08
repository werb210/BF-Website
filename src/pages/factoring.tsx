import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ApplyNowButton, AskQuestionButton } from "@/components/cta-buttons";
import { Seo } from "@/components/SEO";
import { financialServiceJsonLd } from "@/lib/structured-data";

const whoItsFor = [
  "Businesses invoicing creditworthy commercial customers",
  "Contractors waiting on progress billing or retainage",
  "Logistics operators with long shipper payment terms"
];

const useCases = [
  "Accelerate cash from B2B invoices",
  "Cover payroll or fuel while receivables settle",
  "Support rapid growth without taking on long-term debt"
];

const worksWhen = [
  "Invoices are issued to reliable, creditworthy customers",
  "You need cash tied up in receivables",
  "Payment terms are 30-90 days"
];

const notIdealWhen = [
  "Invoices are disputed or to consumers",
  "Margins cannot absorb factoring fees",
  "You only need a single large purchase funded"
];

const requiredDocs = [
  "Accounts receivable aging report",
  "Sample invoices and customer list",
  "3-6 months of bank statements",
  "Basic financial statements"
];

export default function Factoring() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="Invoice Factoring | Boreal Financial" description="Convert outstanding invoices into immediate working capital with Boreal Financial factoring solutions." canonical="https://borealfinancial.ca/factoring" jsonLd={financialServiceJsonLd("Invoice Factoring", "Unlock cash tied up in receivables with factoring facilities.", "/factoring")} />
      <Navigation />

      <main>
        <section className="bg-gradient-to-br from-blue-50 to-white py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
            <p className="text-sm font-semibold text-primary">Factoring</p>
            <h1 className="text-4xl font-bold text-secondary">Turn invoices into working capital</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Factoring advances cash against receivables so you can keep crews, production, and routes moving.
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
