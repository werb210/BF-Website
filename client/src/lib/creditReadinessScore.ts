export type CreditReadinessTier = "green" | "yellow" | "red";

export type CreditReadinessInput = {
  salesHistoryYears?: string;
  annualRevenueRange?: string;
  avgMonthlyRevenueRange?: string;
  accountsReceivableRange?: string;
  fixedAssetsValueRange?: string;
  requestedAmount?: string | number;
  fundingType?: string;
};

const yearsScore = (v?: string): number => {
  const s = (v ?? "").toLowerCase();
  if (s.includes("over 3") || s.includes("5+") || s.includes("3-5")) return 25;
  if (s.includes("1 to 3") || s.includes("2-3")) return 15;
  if (s.includes("under 1") || s.includes("<1")) return 5;
  return 0;
};

const revenueScore = (v?: string): number => {
  const s = (v ?? "").toLowerCase();
  if (s.includes("over $3,000,000") || s.includes("5m+")) return 30;
  if (s.includes("$1,000,001 to $3,000,000") || s.includes("1m-5m")) return 24;
  if (s.includes("$500,001 to $1,000,000") || s.includes("500k-1m")) return 18;
  if (s.includes("$150,001 to $500,000") || s.includes("100k-500k")) return 10;
  if (s.includes("zero to $150,000") || s.includes("<100k")) return 4;
  return 0;
};

const collateralScore = (v?: string): number => {
  const s = (v ?? "").toLowerCase();
  if (s.includes("over $500,000") || s.includes("1m+")) return 20;
  if (s.includes("$250,001 to $500,000") || s.includes("500k")) return 14;
  if (s.includes("$100,001 to $250,000") || s.includes("100k")) return 8;
  if (s.includes("$1 to $50,000") || s.includes("$50,001 to $100,000") || s.includes("<100k")) return 3;
  return 0;
};

const arScore = (v?: string): number => {
  const s = (v ?? "").toLowerCase();
  if (s.includes("over $3,000,000") || s.includes("$1,000,000 to $3,000,000") || s.includes("500k+")) return 15;
  if (s.includes("$250,000 to $500,000") || s.includes("$100,000 to $250,000") || s.includes("100k-500k")) return 10;
  if (s.includes("zero to $100,000") || s.includes("<100k")) return 4;
  return 0;
};

const requestScore = (annualRevenueRange?: string, requestedAmount?: string | number): number => {
  const amount = typeof requestedAmount === "number" ? requestedAmount : Number(String(requestedAmount ?? "").replace(/[^\d]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return 5;

  const rev = (annualRevenueRange ?? "").toLowerCase();
  const revFloor = rev.includes("over $3,000,000") ? 3_000_000 : rev.includes("$1,000,001 to $3,000,000") ? 1_000_000 : rev.includes("$500,001 to $1,000,000") ? 500_000 : rev.includes("$150,001 to $500,000") ? 150_000 : 75_000;

  const ratio = amount / revFloor;
  if (ratio < 0.1) return 10;
  if (ratio < 0.3) return 8;
  if (ratio < 0.6) return 4;
  if (ratio < 1.0) return 1;
  return 0;
};

export function scoreCreditReadiness(input: CreditReadinessInput): { score: number; tier: CreditReadinessTier } {
  const raw = yearsScore(input.salesHistoryYears) + revenueScore(input.annualRevenueRange) + collateralScore(input.fixedAssetsValueRange) + arScore(input.accountsReceivableRange) + requestScore(input.annualRevenueRange, input.requestedAmount);
  const score = Math.max(0, Math.min(100, Math.round(raw)));
  const tier: CreditReadinessTier = score >= 65 ? "green" : score >= 40 ? "yellow" : "red";
  return { score, tier };
}
