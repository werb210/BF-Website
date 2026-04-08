import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/seo/SEO";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/data/faqs";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

export default function FaqPage() {
  const title = "Frequently Asked Questions | Boreal Financial";
  const description = "Get answers about Boreal Financial approval timelines, products, and startup funding options.";

  return (
    <div className="min-h-screen bg-background">
      <SEO title={title} description={description} url="https://borealfinancial.ca/faq" schema={faqSchema} />
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-wider font-semibold text-primary">FAQ</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-secondary">Boreal Financial Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Review common questions about financing products, approval timelines, and startup funding support.
          </p>
        </header>
        <Accordion type="single" collapsible className="faq-list w-full rounded-lg border border-border px-6 bg-card">
          {FAQS.map((faq) => (
            <AccordionItem value={faq.question} key={faq.question} className="faq-item">
              <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <Footer />
    </div>
  );
}
