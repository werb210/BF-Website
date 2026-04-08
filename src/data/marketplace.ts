export type ProductItem = {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
};

export type IndustryItem = {
  slug: string;
  name: string;
  description: string;
  painPoints: string[];
};

export const products: ProductItem[] = [
  {
    slug: "term-loans",
    name: "Term Loans",
    shortDescription: "Predictable capital for expansion, refinancing, and major projects.",
    longDescription:
      "Term loans provide structured repayment and scalable borrowing limits for businesses that need reliable capital planning.",
  },
  {
    slug: "lines-of-credit",
    name: "Lines of Credit",
    shortDescription: "Flexible revolving access to working capital as cash flow changes.",
    longDescription:
      "Lines of credit help bridge payroll, inventory, and receivable cycles without committing to a one-time lump sum.",
  },
  {
    slug: "factoring",
    name: "Factoring",
    shortDescription: "Convert outstanding invoices into immediate operating cash.",
    longDescription:
      "Factoring accelerates access to capital by advancing funds against approved receivables from creditworthy customers.",
  },
  {
    slug: "purchase-order-financing",
    name: "Purchase Order Financing",
    shortDescription: "Fulfill large customer orders without straining supplier payments.",
    longDescription:
      "PO financing helps fund supplier and production costs so businesses can deliver on high-value contracts with confidence.",
  },
  {
    slug: "asset-based-lending",
    name: "Asset Based Lending",
    shortDescription: "Leverage receivables, inventory, and equipment for larger credit facilities.",
    longDescription:
      "ABL facilities unlock borrowing capacity against working assets to support growth and complex cash-flow cycles.",
  },
];

export const industries: IndustryItem[] = [
  {
    slug: "construction",
    name: "Construction",
    description: "Equipment financing, progress billing support, and working capital structured for project-based cash flow.",
    painPoints: ["Retainage delays", "Seasonal labor ramps", "Project mobilization costs"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    description: "Inventory lines, asset-based lending, and equipment facilities aligned with production cycles.",
    painPoints: ["Raw material purchases", "Equipment modernization", "PO-led production cycles"],
  },
  {
    slug: "retail",
    name: "Retail",
    description: "Seasonal working capital, inventory financing, and growth funding for brick-and-mortar and ecommerce.",
    painPoints: ["Seasonal inventory ramps", "Promotion-driven demand spikes", "Receivables delays"],
  },
  {
    slug: "distribution",
    name: "Distribution",
    description: "PO financing, A/R facilities, and revolving lines for supply-chain-driven businesses.",
    painPoints: ["Supplier prepayment pressure", "Long customer terms", "Inventory carrying costs"],
  },
  {
    slug: "media",
    name: "Media",
    description: "Revenue-based financing, contract-backed advances, and structured capital for agencies and creators.",
    painPoints: ["Project-based cash flow", "Client payment lag", "Production upfront costs"],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    description: "Equipment, receivables, and operating capital for clinics, practices, and service providers.",
    painPoints: ["Reimbursement timing", "Equipment upgrades", "Expansion overhead"],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getIndustry(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}
