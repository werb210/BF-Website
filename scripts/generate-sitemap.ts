import fs from "fs"

// BF_WEBSITE_HOTFIX_v17 - single source of truth for the deployed sitemap.
// Run with `npm run sitemap`. tests/deployed-assets.v14.test.ts fails if the
// committed client/public/sitemap.xml does not match this output exactly.
export const BASE = "https://www.boreal.financial"

export const ROUTES: string[] = [
  "/",
  "/us",
  "/compare",
  "/contact",
  "/credit-readiness",
  "/faq",
  "/how-it-works",
  "/industries",
  "/privacy",
  "/products",
  "/sms",
  "/terms",
  "/products/loc",
  "/products/business-loans", // BF_WEBSITE_BUSINESS_LOANS_v24
  "/products/term-loan",
  "/products/equipment-financing",
  "/products/factoring",
  "/products/merchant-cash-advance",
  "/products/po-financing",
  "/products/asset-based-lending",
  "/products/sale-leaseback",
  "/products/sba",
  "/products/media-financing",
  "/industries/construction",
  "/industries/manufacturing",
  "/industries/retail",
  "/industries/restaurant-food-service",
  "/industries/technology",
  "/industries/healthcare",
  "/industries/transportation",
  "/industries/professional-services",
  "/industries/agriculture",
  "/industries/energy",
  "/industries/distribution",
  "/industries/media"
]

export const PRIORITY: Record<string, string> = { "/": "1.0", "/us": "0.9", "/products": "0.9" }

export function priorityFor(route: string): string {
  if (PRIORITY[route]) return PRIORITY[route]
  if (
    route.startsWith("/products/") ||
    route === "/credit-readiness" ||
    route === "/how-it-works" ||
    route === "/industries"
  ) {
    return "0.8"
  }
  if (route.startsWith("/industries/") || route === "/compare" || route === "/contact") {
    return "0.7"
  }
  return "0.6"
}

export function buildSitemap(lastmod: string): string {
  const entries = ROUTES.map(
    (r) => `  <url>\n    <loc>${BASE}${r === "/" ? "/" : r}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priorityFor(r)}</priority>\n  </url>`
  ).join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

if (process.argv[1] && process.argv[1].includes("generate-sitemap")) {
  const lastmod = new Date().toISOString().slice(0, 10)
  fs.writeFileSync("client/public/sitemap.xml", buildSitemap(lastmod))
}
