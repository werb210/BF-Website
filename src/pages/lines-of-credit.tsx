import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ApplyNowButton, AskQuestionButton } from "@/components/cta-buttons";
import { Seo } from "@/components/SEO";
import { financialServiceJsonLd } from "@/lib/structured-data";

const whoItsFor = [
  "Contractors managing payroll and material cycles",
  "Manufacturers with recurring inventory purchases",
  "Logistics operators covering fuel and fleet costs"
];

const useCases = [
  "Bridge gaps between invoice issuance and payment",
  "Cover payroll and material swings",
  "Seasonal or contract-driven working capital needs"
];

const worksWhen = [
  "You need recurring access to working capital",
  "Revenue is consistent enough to support draws",
  "Flexibility matters more than a single lump sum"
];

const notIdealWhen = [
  "The need is a one-time large asset purchase",
  "Invoices are slow-paying and better suited for factoring",
  "Margins are too thin to support revolving payments"
];

const requiredDocs = [
  "6 months of bank statements",
  "Recent financial statements",
  "Accounts receivable aging",
  "Summary of current contracts or revenue sources"
];

export default function LinesOfCredit() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="Lines of Credit | Boreal Financial" description="Flexible revolving lines of credit for payroll, inventory purchases, and operational cash flow." canonical="https://borealfinancial.ca/lines-of-credit" jsonLd={financialServiceJsonLd("Lines of Credit", "Flexible revolving capital for day-to-day operations.", "/lines-of-credit")} />
      <Navigation />

      <main>
        <section className="bg-gradient-to-br from-blue-50 to-white py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
            <p className="text-sm font-semibold text-primary">Lines of Credit</p>
            <h1 className="text-4xl font-bold text-secondary">Flexible capital for ongoing cash-flow cycles</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              A revolving line gives you repeated access to funds so you can cover payroll, materials, and operating costs as they arise.
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
