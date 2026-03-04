import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/data/faqs";

interface SEOFAQProps {
  faqs: FaqItem[];
  title?: string;
}

export function SEOFAQ({ faqs, title = "Frequently Asked Questions" }: SEOFAQProps) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <section className="mt-10">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <h2 className="text-2xl font-semibold text-primary mb-4">{title}</h2>
      <Accordion type="single" collapsible className="faq-list w-full">
        {faqs.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`} className="faq-item">
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
