import { Helmet } from "@/lib/helmetAsync";

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  noindex?: boolean;
}

const SITE_NAME = "Boreal Financial";
const BASE_URL = import.meta.env.VITE_SITE_URL ?? "https://www.boreal.financial";
const DEFAULT_OG_IMAGE = "/images/business-handshake-close-up.jpg";

function getCanonicalUrl(url?: string) {
  if (url) {
    return url.replace("https://www.boreal.financial", BASE_URL).replace("https://www.boreal.financial", BASE_URL);
  }

  // BF_WEBSITE_CANONICAL_NO_QUERY_v25 - see components/SEO.tsx. Same bug, second copy.
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  return `${BASE_URL}${path}`;
}

function getFullTitle(title: string) {
  return title.includes(`| ${SITE_NAME}`) ? title : `${title} | ${SITE_NAME}`;
}

export function SEO({ title, description, url, image, schema, noindex = false }: SEOProps) {
  const canonicalUrl = getCanonicalUrl(url);
  const fullTitle = getFullTitle(title);
  const schemaArray = Array.isArray(schema) ? schema : schema ? [schema] : [];
  const socialImage = image ?? DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={socialImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={socialImage} />

      {schemaArray.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
