import { describe, it, expect } from "vitest";
import { scoreCreditReadiness } from "../creditReadinessScore";

describe("credit readiness scoring", () => {
  it("strong profile is green", () => {
    const r = scoreCreditReadiness({
      salesHistoryYears: "Over 3 Years",
      annualRevenueRange: "Over $3,000,000",
      fixedAssetsValueRange: "Over $500,000",
      accountsReceivableRange: "$1,000,000 to $3,000,000",
      requestedAmount: "100000",
    });
    expect(r.tier).toBe("green");
    expect(r.score).toBeGreaterThanOrEqual(65);
  });

  it("early profile is red", () => {
    const r = scoreCreditReadiness({
      salesHistoryYears: "Under 1 Year",
      annualRevenueRange: "Zero to $150,000",
      fixedAssetsValueRange: "$1 to $50,000",
      accountsReceivableRange: "Zero to $100,000",
      requestedAmount: "200000",
    });
    expect(r.tier).toBe("red");
  });
});
