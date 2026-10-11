// BF_WEBSITE_v789_ROUTE_META - applies the route meta map on every client-side
// navigation through react-helmet-async. Page-level <SEO> renders deeper in the
// tree and wins where both set a tag; for sitemap routes both read the same
// map, so they agree.
import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import { routeMetaFor } from "@/seo/routeMeta";

export default function RouteHead() {
  const [location] = useLocation();
  const meta = routeMetaFor(location);
  if (!meta) return null;
  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />
      <meta property="og:title" content={meta.ogTitle} />
      <meta property="og:description" content={meta.ogDescription} />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:url" content={meta.canonical} />
    </Helmet>
  );
}
