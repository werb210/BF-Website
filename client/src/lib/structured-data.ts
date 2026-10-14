const BASE_URL = (import.meta.env ?? {}).VITE_SITE_URL ?? "https://www.boreal.financial";

// BF_WEBSITE_v789_LOGO - /images/og-image.png never existed, so the
// Organization logo Google reads was a 404. This is the 512px app icon, copied
// into public/images; tests/v789.test.ts checks the file is there.
export const ORGANIZATION_LOGO_PATH = "/images/boreal-logo-512.png";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Boreal Financial",
  url: BASE_URL,
  logo: `${BASE_URL}${ORGANIZATION_LOGO_PATH}`,
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
      name: "How does applying with Boreal work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You apply once with Boreal. Your Boreal advisor prepares your file and, with your approval, presents it to the lenders suited to it, then brings the offers back to you.",
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
