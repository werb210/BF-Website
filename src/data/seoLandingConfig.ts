export const LOCATIONS = ["Toronto", "Calgary", "Vancouver", "Edmonton", "Ottawa", "Montreal"] as const;

export const PRODUCTS = [
  { slug: "working-capital", name: "Working Capital Loans" },
  { slug: "equipment-financing", name: "Equipment Financing" },
  { slug: "startup-funding", name: "Startup Business Funding" }
] as const;

export type SeoLocation = (typeof LOCATIONS)[number];
export type SeoProduct = (typeof PRODUCTS)[number];
