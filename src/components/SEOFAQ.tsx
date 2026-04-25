import { Helmet } from "react-helmet-async";
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
        text: item.answer,
      },
    })),
  };

  return (
    <section className="section section-dark">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <div className="container-bf">
        <h2 className="section-title">{title}</h2>

        <div className="faq-grid">
          {faqs.map((faq) => (
            <div className="faq-item" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
