// BF_WEBSITE_v789_ROUTE_META
// One head-tag record per sitemap route. It is used twice:
//   - at runtime, by components/SEO.tsx and components/RouteHead.tsx through
//     react-helmet-async, so the tags change on client-side navigation;
//   - after the build, by scripts/prerender-head.ts, which writes
//     dist/<route>/index.html with these tags already in <head> so crawlers
//     and link previews that do not run JavaScript see the right page.
// tests/v789.test.ts fails if a sitemap route has no entry here.
//
// Canonical host: https://www.boreal.financial. The apex host is not mapped to
// this site (see tests/deployed-assets.v14.test.ts), so canonicals stay on www.
//
// Pure data only: no window, no import.meta, so node scripts can import it.
import { PRODUCT_CONTENT } from "../data/productContent";
import { industries } from "../data/industries";

export const SITE_ORIGIN = "https://www.boreal.financial";
export const DEFAULT_OG_IMAGE_PATH = "/images/business-handshake-close-up.jpg";

export type RouteMeta = {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
};

type Entry = { title: string; description: string; image?: string };

const STATIC_ROUTES: Record<string, Entry> = {
  "/": {
    title: "Business Financing Canada | 80+ Lenders, One Application | Boreal Financial",
    description:
      "One application matches your business to 80+ Canadian lenders. Term loans, lines of credit, equipment and working capital. Funding in as little as 3-4 days. Boreal never pulls your credit.",
  },
  "/us": {
    title: "Business Financing USA | One Application, Many Lenders | Boreal Financial",
    description:
      "One application reaches the US lenders that fund businesses like yours. SBA 7(a) and 504, term loans, lines of credit, equipment and working capital. Boreal never pulls your credit.",
  },
  "/compare": {
    title: "Compare Business Financing Options | Boreal Financial",
    description:
      "Term loans, lines of credit, factoring, equipment finance and more, side by side - amount, speed, term, cost basis and collateral.",
  },
  "/contact": {
    title: "Contact Boreal Financial | Talk To A Real Person",
    description:
      "Questions about business financing? Call +1 (866) 631-8939 or send us a message. No cost, no obligation.",
  },
  "/credit-readiness": {
    title: "See What Your Business Could Qualify For | Boreal Financial",
    description:
      "Answer a few questions and we'll tell you which kinds of financing are realistic. Two minutes, no documents needed, and no credit check.",
  },
  "/faq": {
    title: "Business Financing FAQ | Boreal Financial",
    description: "Common questions about applying, qualifying, credit checks, timing and cost.",
  },
  "/how-it-works": {
    title: "How Business Financing Works With Boreal | One Application, 80+ Lenders",
    description:
      "Apply once. We take your file to 80+ Canadian lenders and come back with what you qualify for. Funding in as little as 3-4 days. Boreal never pulls your credit.",
  },
  "/industries": {
    title: "Business Financing By Industry | Canada | Boreal Financial",
    description:
      "Financing built around how your industry actually runs - progress draws, seasonal swings, fleet purchases, patient receivables. One application, 80+ Canadian lenders.",
  },
  "/privacy": {
    title: "Privacy Policy | Boreal Financial",
    description:
      "How Boreal Financial (2630108 Alberta Ltd.) collects, uses, shares and protects personal information, including cookies, analytics and advertising.",
  },
  "/products": {
    title: "Business Financing Products | Term Loans, LOC, Equipment | Boreal Financial",
    description:
      "Term loans, lines of credit, factoring, equipment finance, asset-based lending, sale and leaseback and SBA. One application reaches all of them.",
  },
  "/sms": {
    title: "SMS Communications & Opt-Out | Boreal Financial",
    description: "How Boreal Financial sends SMS messages, and how to opt out.",
  },
  "/terms": {
    title: "Terms of Service | Boreal Financial",
    description: "The terms governing use of the Boreal Financial website and application services.",
  },
};

function buildEntries(): Record<string, Entry> {
  const entries: Record<string, Entry> = { ...STATIC_ROUTES };
  // Same title/description ProductDetail.tsx and IndustryDetail.tsx render.
  for (const p of PRODUCT_CONTENT) {
    entries[`/products/${p.slug}`] = { title: `${p.name} | Boreal Financial`, description: p.def };
  }
  for (const i of industries) {
    entries[`/industries/${i.slug}`] = {
      title: `${i.title} Financing Canada | Boreal Financial`,
      description: i.description,
    };
  }
  return entries;
}

const ENTRIES = buildEntries();

export function normalizeRoutePath(path: string): string {
  const bare = (path.split(/[?#]/)[0] || "/").replace(/\/+$/, "");
  return bare === "" ? "/" : bare;
}

export function absoluteUrl(pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE_ORIGIN}${pathOrUrl}`;
}

export function routeMetaFor(path: string): RouteMeta | undefined {
  const key = normalizeRoutePath(path);
  const entry = ENTRIES[key];
  if (!entry) return undefined;
  return {
    path: key,
    title: entry.title,
    description: entry.description,
    canonical: key === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${key}`,
    ogTitle: entry.title,
    ogDescription: entry.description,
    ogImage: absoluteUrl(entry.image ?? DEFAULT_OG_IMAGE_PATH),
  };
}

export function routeMetaPaths(): string[] {
  return Object.keys(ENTRIES);
}
