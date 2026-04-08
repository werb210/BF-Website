export type Product = {
  slug: string;
  name: string;
  heroImage: string;
  intro: string;
  bestFor: string[];
  howItWorks: string[];
  requirements: string[];
};

export type Industry = {
  slug: string;
  name: string;
  heroImage: string;
  overview: string;
  examples: string[];
};

export const products: Product[] = [
  {
    slug: "term-loans",
    name: "Term Loans",
    heroImage: "/images/business-handshake-close-up.jpg",
    intro:
      "Term loans provide fixed-amount capital with structured repayment, making them ideal for expansion projects, refinancing expensive debt, or funding major strategic investments.",
    bestFor: [
      "Expansion initiatives such as opening locations, adding production capacity, or launching a new service line",
      "High-ticket contract execution where working capital alone cannot carry project costs",
      "Debt consolidation strategies aimed at simplifying payments and improving cash-flow planning",
    ],
    howItWorks: [
      "Complete one Boreal application and upload key business documents once",
      "Boreal packages your file and presents it to suitable term-loan lenders across the marketplace",
      "Compare rate options, amortization schedules, fees, and covenant terms before choosing a facility",
    ],
    requirements: [
      "At least 6 months of business operations (longer history generally improves terms)",
      "Verifiable operating revenue and business bank account activity",
      "Standard business documentation including ownership details and core financial records",
    ],
  },
  {
    slug: "lines-of-credit",
    name: "Line of Credit",
    heroImage: "/images/pngtree-diverse-team-of-professionals-collaborating-in-a-modern-office-setting-with-image_20052579.webp",
    intro:
      "A business line of credit offers revolving access to capital you can draw, repay, and draw again, helping you cover recurring short-term gaps without repeatedly reapplying.",
    bestFor: [
      "Seasonal or cyclical cash-flow businesses with predictable peaks and troughs",
      "Managing payroll, rent, and vendor obligations while waiting for customer receivables",
      "Businesses that need liquidity flexibility but want to borrow only what is required at any moment",
    ],
    howItWorks: [
      "Submit one marketplace intake with your recent financial and banking profile",
      "Lenders evaluate your operating stability and propose revolving limits with pricing",
      "Once approved, draw funds as needed and repay to restore available credit capacity",
    ],
    requirements: [
      "Active business chequing account and recent bank statements",
      "Demonstrable revenue activity and reasonable business credit profile",
      "Basic corporate documentation, ownership verification, and operating history",
    ],
  },
  {
    slug: "factoring",
    name: "Factoring",
    heroImage: "/images/factoring-financing.jpeg",
    intro:
      "Factoring unlocks cash tied up in accounts receivable by advancing funds against eligible invoices, improving liquidity without waiting 30, 60, or 90 days for customer payment.",
    bestFor: [
      "B2B companies with strong customers that pay on extended terms",
      "Fast-growing firms where receivables growth is outpacing available working capital",
      "Operators that need dependable payroll and supplier liquidity while invoices age",
    ],
    howItWorks: [
      "Share sample invoices, AR aging reports, and customer concentration details",
      "Lenders assess customer credit quality, invoice validity, and payment history",
      "Receive advance-rate and fee proposals, then choose a factoring structure that matches your cycle",
    ],
    requirements: [
      "Invoice-based B2B revenue with clear documentation and delivery proof",
      "Trackable receivables aging and customer payment behavior",
      "Customer contracts, purchase confirmations, or equivalent support records",
    ],
  },
  {
    slug: "equipment-financing",
    name: "Equipment Financing",
    heroImage: "/images/Take possession of your new manufacturing equipment.jpeg",
    intro:
      "Equipment financing helps businesses acquire revenue-producing assets while preserving cash reserves, with repayment terms designed around useful life and business cash flow.",
    bestFor: [
      "Fleet expansion or replacement for transportation and field-service operations",
      "Manufacturing upgrades where new machinery boosts output and efficiency",
      "Construction or industrial operators requiring specialized high-cost assets",
    ],
    howItWorks: [
      "Provide equipment quotes, vendor details, and a summary of intended commercial use",
      "Lenders underwrite based on asset type, resale profile, and your business performance",
      "Choose from lease and loan options aligned to budget, seasonality, and long-term ownership goals",
    ],
    requirements: [
      "Commercial-use equipment quote or invoice from an approved supplier",
      "Core financial information and recent business bank activity",
      "Business registration details and ownership identity documentation",
    ],
  },
  {
    slug: "purchase-order-financing",
    name: "Purchase Order Financing",
    heroImage: "/images/An image of two groups of business people shaking hands over a meeting table celebrating signing a deal to merge.jpeg.webp",
    intro:
      "Purchase order financing funds supplier and production costs tied to confirmed customer orders, helping you fulfill larger contracts without straining working capital.",
    bestFor: [
      "Wholesalers and distributors handling large confirmed customer orders",
      "Businesses with reliable buyers but supplier prepayment requirements",
      "Growth-stage companies that need external support to scale fulfillment capacity",
    ],
    howItWorks: [
      "Submit signed purchase orders, supplier terms, and transaction flow details",
      "Lenders review buyer credibility, gross margins, and delivery milestones",
      "Funding is deployed to support production and supplier obligations through fulfillment",
    ],
    requirements: [
      "Verifiable purchase order from a credible end buyer",
      "Qualified supplier relationships with documented commercial terms",
      "Operational track record showing fulfillment reliability and margin capacity",
    ],
  },
  {
    slug: "merchant-cash-advance",
    name: "Merchant Cash Advance",
    heroImage: "/images/premium_photo-1661962673986-dcffa2a05e07.jpg",
    intro:
      "Merchant cash advances provide fast capital repaid from future card or receivable sales, making them useful for urgent funding scenarios where speed is critical.",
    bestFor: [
      "Retail, hospitality, and service businesses with meaningful card-processing volume",
      "Time-sensitive expenses such as repairs, urgent inventory, or immediate staffing needs",
      "Operators seeking quick approval pathways when traditional facilities are too slow",
    ],
    howItWorks: [
      "Submit recent sales, processing, and bank activity to establish receivable patterns",
      "Advance size is set based on expected future receivables and payment consistency",
      "Repayments are collected as fixed daily/weekly amounts or percentage-based receivable sweeps",
    ],
    requirements: [
      "Consistent monthly sales and active merchant processing history",
      "Recent business bank and processing statements",
      "Valid business registration and ownership verification",
    ],
  },
  {
    slug: "asset-based-lending",
    name: "Asset-Based Lending",
    heroImage: "/images/tohcyytw4kftsfv6ivr2.jpg",
    intro:
      "Asset-based lending creates flexible borrowing capacity secured by receivables, inventory, or equipment, supporting businesses with strong assets but complex cash cycles.",
    bestFor: [
      "Asset-heavy businesses seeking larger limits than unsecured facilities",
      "Companies with fluctuating working-capital demands tied to growth or seasonality",
      "Organizations needing tailored structures around collateral reporting and draw controls",
    ],
    howItWorks: [
      "Assess eligible collateral pools and reporting quality across AR, inventory, or equipment",
      "Lenders establish an advance formula and borrowing-base mechanics",
      "Facility availability adjusts over time based on updated collateral values and compliance",
    ],
    requirements: [
      "Detailed collateral reporting, including AR aging and inventory summaries where relevant",
      "Current financial statements and operating performance visibility",
      "Complete collateral documentation and legal entity records",
    ],
  },
];

export const industries: Industry[] = [
  {
    slug: "construction",
    name: "Construction",
    heroImage: "/images/industries/construction.jpg",
    overview:
      "Equipment financing, progress billing support, and working capital structured for project-based cash flow.",
    examples: [
      "General contractors managing multiple active project timelines",
      "Specialty trades financing labor peaks, mobilization, and material deposits",
      "Civil and infrastructure firms balancing long receivable cycles against operating burn",
    ],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    heroImage: "/images/industries/manufacturing.jpg",
    overview:
      "Inventory lines, asset-based lending, and equipment facilities aligned with production cycles.",
    examples: [
      "Food and beverage producers funding packaging, ingredient, and distribution cycles",
      "Light industrial manufacturers modernizing machinery and throughput",
      "Custom fabrication shops managing large order deposits and staged invoicing",
    ],
  },
  {
    slug: "retail",
    name: "Retail",
    heroImage: "/images/industries/retail.jpg",
    overview:
      "Seasonal working capital, inventory financing, and growth funding for brick-and-mortar and ecommerce.",
    examples: [
      "Multi-location retailers stocking inventory ahead of peak seasons",
      "Ecommerce brands balancing ad spend, inventory, and shipping cycles",
      "Consumer goods operators launching new product lines",
    ],
  },
  {
    slug: "distribution",
    name: "Distribution",
    heroImage: "/images/industries/distribution.jpg",
    overview:
      "PO financing, A/R facilities, and revolving lines for supply-chain-driven businesses.",
    examples: [
      "Wholesalers managing supplier prepayments and receivable delays",
      "Import/export distributors financing inventory in transit",
      "Regional distributors scaling contract volume with revolving facilities",
    ],
  },
  {
    slug: "media",
    name: "Media",
    heroImage: "/images/industries/media.jpg",
    overview:
      "Revenue-based financing, contract-backed advances, and structured capital for agencies and creators.",
    examples: [
      "Agencies smoothing cash flow between campaign delivery and payment",
      "Production studios funding project costs before milestone payouts",
      "Creator-led businesses scaling teams and content output",
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    heroImage: "/images/premium_photo-1661962673986-dcffa2a05e07.jpg",
    overview:
      "Equipment, receivables, and operating capital for clinics, practices, and service providers.",
    examples: [
      "Clinics investing in diagnostic and treatment equipment",
      "Practices bridging insurer and payer receivable timing",
      "Healthcare operators expanding to new locations",
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getIndustryBySlug(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}
