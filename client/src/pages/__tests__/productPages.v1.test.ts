// BF_WEBSITE_PRODUCT_PAGES_v1 - mockup-structure product pages.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
const detail = readFileSync(join(process.cwd(), "client", "src", "pages", "ProductDetail.tsx"), "utf-8");
const index = readFileSync(join(process.cwd(), "client", "src", "pages", "Products.tsx"), "utf-8");
const content = readFileSync(join(process.cwd(), "client", "src", "data", "productContent.ts"), "utf-8");
describe("product pages", () => {
  it("detail renders all mockup sections with ranges OFF", () => {
    for (const sec of ["How it works", "At a glance", "Is it right for you?", "A real-world example", "What drives your cost", "Questions people ask", "Used most in"]) {
      expect(detail).toContain(sec);
    }
    expect(detail).toContain("const SHOW_RANGES = false;");
  });
  it("index has the 7-column comparison table for all 8 products", () => {
    expect(index).toContain('"Collateral"');
    expect(content.match(/slug:"/g)?.length).toBe(8);
  });
});
