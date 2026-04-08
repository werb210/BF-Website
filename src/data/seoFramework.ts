export interface SlugNameItem {
  slug: string;
  name: string;
}

export interface LocationItem extends SlugNameItem {
  province: string;
}

export interface ComparisonItem {
  slug: string;
  title: string;
}

export interface CaseStudyItem {
  slug: string;
  city: string;
  province: string;
  industry: string;
  industrySlug: string;
  productSlug: string;
  amount: number;
  challenge: string;
  outcome: string;
}

export const PRODUCTS = [
  { slug: "working-capital", name: "Working Capital Loans" },
  { slug: "equipment-financing", name: "Equipment Financing" },
  { slug: "startup-funding", name: "Startup Business Funding" }
];

export const LOCATIONS = [
  { slug: "toronto", name: "Toronto", province: "Ontario" },
  { slug: "calgary", name: "Calgary", province: "Alberta" },
  { slug: "vancouver", name: "Vancouver", province: "British Columbia" },
  { slug: "edmonton", name: "Edmonton", province: "Alberta" },
  { slug: "ottawa", name: "Ottawa", province: "Ontario" },
  { slug: "montreal", name: "Montreal", province: "Quebec" }
];

export const INDUSTRIES = [
  { slug: "construction", name: "Construction" },
  { slug: "manufacturing", name: "Manufacturing" },
  { slug: "transportation", name: "Transportation & Logistics" },
  { slug: "hospitality", name: "Hospitality" }
];

export const COMPARISONS = [
  { slug: "working-capital-vs-line-of-credit", title: "Working Capital vs Line of Credit" },
  { slug: "equipment-financing-vs-bank-loan", title: "Equipment Financing vs Bank Loan" },
  { slug: "factoring-vs-mca", title: "Invoice Factoring vs Merchant Cash Advance" }
];

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    slug: "construction-firm-toronto-250k-working-capital",
    city: "Toronto",
    province: "Ontario",
    industry: "Construction",
    industrySlug: "construction",
    productSlug: "working-capital",
    amount: 250000,
    challenge: "progress payments lagged behind payroll and material commitments",
    outcome: "the firm stabilized payroll for two projects and negotiated supplier discounts"
  },
  {
    slug: "manufacturer-calgary-400k-equipment-upgrade",
    city: "Calgary",
    province: "Alberta",
    industry: "Manufacturing",
    industrySlug: "manufacturing",
    productSlug: "equipment-financing",
    amount: 400000,
    challenge: "aging CNC assets were driving rework and lead-time overruns",
    outcome: "new production equipment increased throughput and reduced scrap rates"
  },
  {
    slug: "hospitality-group-vancouver-150k-startup-launch",
    city: "Vancouver",
    province: "British Columbia",
    industry: "Hospitality",
    industrySlug: "hospitality",
    productSlug: "startup-funding",
    amount: 150000,
    challenge: "opening inventory, staffing, and fit-out expenses clustered before revenue",
    outcome: "the location opened on schedule and reached monthly cash-flow breakeven faster"
  }
];

export const PRODUCT_BY_SLUG = new Map(PRODUCTS.map((item) => [item.slug, item]));
export const LOCATION_BY_SLUG = new Map(LOCATIONS.map((item) => [item.slug, item]));
export const INDUSTRY_BY_SLUG = new Map(INDUSTRIES.map((item) => [item.slug, item]));
export const COMPARISON_BY_SLUG = new Map(COMPARISONS.map((item) => [item.slug, item]));
export const CASE_STUDY_BY_SLUG = new Map(CASE_STUDIES.map((item) => [item.slug, item]));
