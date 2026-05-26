// BF_WEBSITE_BLOCK_v153_MOBILE_FIRST_LAUNCH_v1
import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const root = path.resolve(__dirname, "..");
const r = (p: string) => fs.readFileSync(path.resolve(root, p), "utf8");

const layout = r("layouts/MainLayout.tsx");
const scroll = r("components/ScrollToTop.tsx");
const industries = r("pages/Industries.tsx");
const navbar = r("components/Navbar.tsx");

describe("v153 — ScrollToTop wired into MainLayout", () => {
  it("ScrollToTop component exists and uses scrollToTop()", () => {
    expect(scroll).toMatch(/import.*scrollToTop.*from.*scrollToTop/);
    expect(scroll).toMatch(/useEffect[\s\S]*scrollToTop\(\)/);
  });
  it("MainLayout imports and mounts ScrollToTop", () => {
    expect(layout).toMatch(/import\s+ScrollToTop\s+from/);
    expect(layout).toMatch(/<ScrollToTop\s*\/>/);
  });
});

describe("v153 — Industries page shows cards only (no pill list)", () => {
  it("no selector-prefix pill grid", () => {
    expect(industries).not.toMatch(/selector-\$\{industry\.slug\}/);
    expect(industries).not.toMatch(/rounded-full\s+border\s+border-white\/20\s+bg-\[#08132a\]/);
  });
  it("cards grid still present", () => {
    expect(industries).toMatch(/grid-cols-2[\s\S]+industry\.image/);
  });
});

describe("v153 — Navbar mobile menu z-index", () => {
  it("mobile menu uses z-[70] (above hero z-50)", () => {
    expect(navbar).toMatch(/z-\[70\]/);
  });
});
