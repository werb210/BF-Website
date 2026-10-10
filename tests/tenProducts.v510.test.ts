// BF_WEBSITE_TEN_PRODUCTS_v510 + BF_WEBSITE_US_LINK_v510
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const home = readFileSync("client/src/pages/Home.tsx", "utf8");
const content = readFileSync("client/src/data/productContent.ts", "utf8");

test("the home page lists every product it links to, and says how many", () => {
  const block = home.slice(home.indexOf("const PRODUCTS = ["), home.indexOf("] as const;", home.indexOf("const PRODUCTS = [")));
  const slugs = [...block.matchAll(/^\s*\["([a-z-]+)",/gm)].map((m) => m[1]);
  assert.equal(slugs.length, 10);
  for (const slug of slugs) assert.match(content, new RegExp('slug:"' + slug + '"'));
  assert.ok(slugs.includes("sba"));
  assert.match(home, /Ten ways to fund/);
  assert.doesNotMatch(home, /Seven ways to fund/);
});

test("the US FAQ answer links to the US page instead of printing /us", () => {
  assert.doesNotMatch(home, /financing page at \/us\./);
  assert.match(home, /"Do you lend in the United States\?": \{ href: "\/us", label: "US financing page" \}/);
  assert.match(home, /<Link href=\{FAQ_LINKS\[q\]\.href\}/);
});
