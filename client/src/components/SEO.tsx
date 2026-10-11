// BF_WEBSITE_v789_REAL_PACKAGES - the real react-helmet-async (HelmetProvider
// is mounted in main.tsx). The vendored "react-helmet" stand-in only patched a
// few tags in an effect and never removed stale ones.
import { Helmet } from "react-helmet-async";
import { routeMetaFor } from "@/seo/routeMeta"; // BF_WEBSITE_v789_ROUTE_META

type Props = {
  title: string;
  description: string;
  canonical?: string;
  url?: string;
  // BF_WEBSITE_SEO_MERGE_v26 - ported from the deleted client/src/seo/SEO.tsx,
  // which was the only copy that emitted og:image.
  image?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  noindex?: boolean;
};

function getSchema(props: Props) {
  return props.schema ?? props.jsonLd;
}

const SITE_NAME = "Boreal Financial";
// BF_WEBSITE_SEO_v9 - the canonical domain is boreal.financial. The previous
// default pointed every canonical tag at a domain we do not own.
const SITE_URL = (import.meta.env ?? {}).VITE_SITE_URL ?? "https://www.boreal.financial";
const DEFAULT_OG_IMAGE = "/images/business-handshake-close-up.jpg";

function normalizeHref(href?: string) {
  if (!href) return href;
  return href.replace("https://www.boreal.financial", SITE_URL);
}

function formatTitle(title: string) {
  return title.includes(`| ${SITE_NAME}`) ? title : `${title} | ${SITE_NAME}`;
}

export default function SEO(props: Props) {
  const { title, description, canonical, url, image, noindex } = props;
  const schema = getSchema(props);
  const schemaBlocks = schema ? (Array.isArray(schema) ? schema : [schema]) : [];
  // BF_WEBSITE_CANONICAL_NO_QUERY_v25 - a canonical URL must identify the page,
  // not the visit. The browser query string used to be appended, so ?gclid=... and
  // every utm_* combination each produced a distinct canonical.
  const pathname = typeof window !== "undefined" ? window.location.pathname : undefined;
  // BF_WEBSITE_v789_ROUTE_META - a sitemap route takes its title, description,
  // canonical and Open Graph tags from the route meta map, so what JavaScript
  // renders matches the head that scripts/prerender-head.ts bakes into
  // dist/<route>/index.html.
  const routeHead = pathname ? routeMetaFor(pathname) : undefined;
  const canonicalUrl = routeHead?.canonical ?? normalizeHref(canonical ?? url ?? (pathname !== undefined ? `${SITE_URL}${pathname}` : SITE_URL));
  const fullTitle = routeHead?.title ?? formatTitle(title);
  const metaDescription = routeHead?.description ?? description;
  const ogImage = routeHead?.ogImage ?? `${SITE_URL}${image ?? DEFAULT_OG_IMAGE}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={routeHead?.ogTitle ?? fullTitle} />
      <meta property="og:description" content={routeHead?.ogDescription ?? metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      {schemaBlocks.length > 0 ? (
        <script type="application/ld+json">
          {JSON.stringify(schemaBlocks.length === 1 ? schemaBlocks[0] : schemaBlocks)}
        </script>
      ) : null}
    </Helmet>
  );
}

// BF_WEBSITE_SCHEMA_v18 - kept as an alias so existing imports keep working.
// The default export now renders schema itself.
export function Seo(props: Props) {
  return <SEO {...props} />;
}
