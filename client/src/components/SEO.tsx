import { Helmet } from "react-helmet";

type Props = {
  title: string;
  description: string;
  canonical?: string;
  url?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  noindex?: boolean;
};

function getSchema(props: Props) {
  return props.schema ?? props.jsonLd;
}

const SITE_NAME = "Boreal Financial";
const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://borealfinancial.ca";

function normalizeHref(href?: string) {
  if (!href) return href;
  return href.replace("https://borealfinancial.ca", SITE_URL);
}

function formatTitle(title: string) {
  return title.includes(`| ${SITE_NAME}`) ? title : `${title} | ${SITE_NAME}`;
}

export default function SEO({ title, description, canonical, url, noindex }: Props) {
  const canonicalUrl = normalizeHref(canonical ?? url ?? (typeof window !== "undefined" ? `${SITE_URL}${window.location.pathname}${window.location.search}` : SITE_URL));
  const fullTitle = formatTitle(title);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
    </Helmet>
  );
}

export function Seo(props: Props) {
  const schema = getSchema(props);

  return (
    <>
      <SEO {...props} />
      {Array.isArray(schema)
        ? schema.map((item, index) => (
            <script key={index} type="application/ld+json">
              {JSON.stringify(item)}
            </script>
          ))
        : schema
          ? <script type="application/ld+json">{JSON.stringify(schema)}</script>
          : null}
    </>
  );
}
