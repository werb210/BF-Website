export interface ProductCluster {
  slug: string;
  name: string;
}

export interface SeoClusters {
  products: ProductCluster[];
  locations: string[];
  industries: string[];
  intents: string[];
}

export const seoClusters: SeoClusters = {
  products: [
    { slug: "working-capital", name: "Working Capital Loans" },
    { slug: "equipment-financing", name: "Equipment Financing" },
    { slug: "startup-funding", name: "Startup Business Funding" }
  ],
  locations: ["Toronto", "Calgary", "Vancouver", "Edmonton", "Ottawa", "Montreal"],
  industries: ["construction", "manufacturing", "transportation", "hospitality"],
  intents: ["fast approval", "no collateral", "poor credit friendly"]
};
