import { SITE_URL as BASE_SITE_URL } from "@/config/links";
export const SITE_URL = BASE_SITE_URL;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Boreal Financial",
  url: SITE_URL,
  logo: SITE_URL,
  sameAs: ["https://www.linkedin.com/company/boreal-financial"],
};

export const financialServiceSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Boreal Financial",
  url: SITE_URL,
  areaServed: {
    "@type": "Country",
    name: "Canada",
  },
  serviceType: ["Business Line of Credit", "Term Loans", "Invoice Factoring"],
};

export const serviceSchema = (name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  provider: {
    "@type": "Organization",
    name: "Boreal Financial",
  },
  areaServed: {
    "@type": "Country",
    name: "Canada",
  },
  url: `${SITE_URL}${path}`,
});

export const faqSchema = (items: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});
