// BF_WEBSITE_EQUIPMENT_TAX_2026_v1 - the calculator's maths (pure, no imports) for the Budget 2026 equipment page.
export type AssetKind = { id: string; label: string; previousRate: number; examples: string };

// Year-one deduction under the previous rules: the class rate, without the half-year rule (suspended for assets
// available for use 2024-2027 under the Accelerated Investment Incentive phase-out). Approximate on purpose.
export const ASSET_KINDS: AssetKind[] = [
  { id: "general", label: "Machinery and general equipment", previousRate: 0.2, examples: "Restaurant equipment, tools, furniture, medical equipment, conveyors" },
  { id: "construction", label: "Construction and heavy equipment", previousRate: 0.3, examples: "Excavators, loaders, bulldozers, cranes, graders" },
  { id: "trucks", label: "Heavy trucks and tractors for hauling", previousRate: 0.4, examples: "Heavy freight trucks, highway tractors" },
  { id: "tech", label: "Computers and point-of-sale hardware", previousRate: 0.55, examples: "Computers, servers, point-of-sale hardware" },
];

// Combined federal + provincial corporate income tax rates (federal 9% small business, 15% general), approximate.
// BF_WEBSITE_EQUIPMENT_TAX_2026_v2 - the provinces the campaign reaches, BC to Ontario.
export type Province = { id: string; label: string; small: number; general: number };
export const PROVINCES: Province[] = [
  { id: "BC", label: "British Columbia", small: 0.11, general: 0.27 },
  { id: "AB", label: "Alberta", small: 0.11, general: 0.23 },
  { id: "SK", label: "Saskatchewan", small: 0.1, general: 0.27 },
  { id: "MB", label: "Manitoba", small: 0.09, general: 0.27 },
  { id: "ON", label: "Ontario", small: 0.122, general: 0.265 },
];

export const RATE_TYPES = [
  { id: "small", label: "Small business rate" },
  { id: "general", label: "General corporate rate" },
  { id: "custom", label: "My own rate" },
] as const;

export function provinceRate(provinceId: string, rateType: string): number {
  const p = PROVINCES.find((x) => x.id === provinceId) ?? PROVINCES[1];
  if (!p) return 0;
  return rateType === "general" ? p.general : rateType === "small" ? p.small : 0;
}

export const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;

export function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export function calculate(input: { cost: number; previousRate: number; taxRate: number; financeRatePct: number; termMonths: number; downPayment: number }) {
  const cost = Math.max(0, input.cost);
  const before = cost * input.previousRate;
  const after = cost;
  const extraDeduction = after - before;
  const taxSaving = extraDeduction * Math.max(0, input.taxRate);
  const financed = Math.max(0, cost - Math.max(0, input.downPayment));
  const payment = monthlyPayment(financed, input.financeRatePct, input.termMonths);
  const monthsCovered = payment > 0 ? taxSaving / payment : 0;
  return { before, after, extraDeduction, taxSaving, financed, payment, monthsCovered };
}

