// BF_WEBSITE_EQUIPMENT_TAX_2026_v1
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { calculate, monthlyPayment, provinceRate, PROVINCES, provinceFromTimeZone, visitorProvince } from "../../lib/equipmentTax";

const root = path.resolve(__dirname, "../..");
const r = (p: string) => fs.readFileSync(path.resolve(root, p), "utf8");

describe("Budget 2026 equipment tax calculator", () => {
  it("compares year-one deductions and prices the saving", () => {
    const x = calculate({ cost: 250000, previousRate: 0.3, taxRate: 0.23, financeRatePct: 9.5, termMonths: 60, downPayment: 0 });
    assert.equal(x.before, 75000);
    assert.equal(x.after, 250000);
    assert.equal(x.extraDeduction, 175000);
    assert.ok(Math.abs(x.taxSaving - 40250) < 1);
    assert.ok(Math.abs(x.payment - 5250.5) < 2);
    assert.ok(x.monthsCovered > 7 && x.monthsCovered < 8);
  });
  it("handles a fully paid purchase and a zero rate", () => {
    assert.equal(calculate({ cost: 100000, previousRate: 0.2, taxRate: 0.11, financeRatePct: 9, termMonths: 60, downPayment: 100000 }).payment, 0);
    assert.equal(monthlyPayment(12000, 0, 12), 1000);
  });
  it("covers BC to Ontario with combined rates", () => {
    assert.deepEqual(PROVINCES.map((p) => p.id), ["BC", "AB", "SK", "MB", "ON"]);
    assert.equal(provinceRate("ON", "general"), 0.265);
    assert.equal(provinceRate("MB", "small"), 0.09);
    assert.equal(provinceRate("BC", "custom"), 0);
  });
  it("pre-selects the province from the time zone", () => {
    assert.equal(provinceFromTimeZone("America/Vancouver"), "BC");
    assert.equal(provinceFromTimeZone("America/Regina"), "SK");
    assert.equal(provinceFromTimeZone("America/Winnipeg"), "MB");
    assert.equal(provinceFromTimeZone("America/Toronto"), "ON");
    assert.equal(provinceFromTimeZone("America/Halifax"), "AB");
    assert.equal(provinceFromTimeZone(undefined), "AB");
    assert.equal(visitorProvince(() => { throw new Error("no Intl"); }), "AB");
  });
  it("is routed, in the sitemap meta, and has an Apply button and the disclaimer", () => {
    assert.match(r("router/AppRouter.tsx"), /path="\/equipment-tax-2026"/);
    assert.match(r("seo/routeMeta.ts"), /"\/equipment-tax-2026"/);
    const page = r("pages/EquipmentTax2026.tsx");
    assert.match(page, /data-testid="apply"/);
    assert.match(page, /not tax advice/);
    assert.match(page, /September 15, 2026/);
  });
});
