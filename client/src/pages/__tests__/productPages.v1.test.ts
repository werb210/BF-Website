// BF_WEBSITE_PRODUCT_PAGES_v1 - mockup-structure product pages.
// BF_WEBSITE_NODE22_TEST_DISCOVERY_v3 - converted from vitest to node:test; see
// SmsInfo.v1.test.ts for why this never ran under Node 20.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const detail = readFileSync(join(process.cwd(), "client", "src", "pages", "ProductDetail.tsx"), "utf-8");
const index = readFileSync(join(process.cwd(), "client", "src", "pages", "Products.tsx"), "utf-8");
const content = readFileSync(join(process.cwd(), "client", "src", "data", "productContent.ts"), "utf-8");

describe("product pages", () => {
  it("detail renders all mockup sections with ranges OFF", () => {
    for (const sec of ["How it works", "At a glance", "Is it right for you?", "A real-world example", "What drives your cost", "Questions people ask", "Used most in"]) {
      assert.ok(detail.includes(sec), `ProductDetail.tsx is missing section: ${sec}`);
    }
    assert.ok(detail.includes("const SHOW_RANGES = false;"), "SHOW_RANGES is not off");
  });

  it("index features the approved product set as cards", () => {
    for (const slug of ["term-loan", "loc", "factoring", "equipment-financing",
                        "asset-based-lending", "sale-leaseback",
                        "commercial-real-estate", "sba"]) {
      assert.ok(index.includes(`slug: "${slug}"`), `Products.tsx is missing ${slug}`);
    }
    assert.ok(!index.includes('slug: "merchant-cash-advance"'),
      "MCA must not be featured on the index");
    // BF_WEBSITE_PRODUCT_DETAIL_v6 - was 8; sale-leaseback,
    // commercial-real-estate and sba were added because they are linked from
    // the homepage, products index and industry pages.
    assert.equal(content.match(/slug:"/g)?.length, 11);
  });
});
