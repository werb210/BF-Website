import { getEnv } from "@/config/env";
const BASE_URL = getEnv().VITE_SITE_URL;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Boreal Financial",
  url: BASE_URL,
  logo: `${BASE_URL}/images/og-image.png`,
  sameAs: ["https://www.linkedin.com/company/borealfinancial"],
};

export function webPageJsonLd(path: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${BASE_URL}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Boreal Financial",
      url: BASE_URL,
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

export function financialServiceJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `Boreal Financial ${name}`,
    description,
    url: `${BASE_URL}${path}`,
    provider: {
      "@type": "Organization",
      name: "Boreal Financial",
      url: BASE_URL,
    },
    areaServed: ["CA", "US"],
    serviceType: name,
  };
}

export const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Boreal's lending marketplace work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You submit one application and Boreal routes it to fit-matched lenders for structured offers.",
      },
    },
    {
      "@type": "Question",
      name: "Which geographies are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Boreal supports commercial borrowers across Canada and the United States.",
      },
    },
  ],
};

export const coreFaqJsonLd = homeFaqJsonLd;
