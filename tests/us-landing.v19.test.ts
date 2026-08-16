// BF_WEBSITE_US_v19 - the US campaign was landing on Canadian copy.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const PAGE = "client/src/pages/UnitedStates.tsx";

test("the US page is routed", () => {
  const router = fs.readFileSync("client/src/router/AppRouter.tsx", "utf8");
  assert.match(router, /path="\/us"/, "/us is not mounted");
  assert.match(router, /UnitedStates/, "the US page is not imported");
});

test("the US page makes no Canada-specific claim", () => {
  const src = fs.readFileSync(PAGE, "utf8");
  assert.ok(!/Canadian lenders/.test(src), "US page claims Canadian lenders");
  assert.ok(!/Canada-wide/i.test(src), "US page carries Canada-wide positioning");
  assert.ok(!/six months.*\$10,000 a month/is.test(src), "US page states the Canadian eligibility rule");
});

test("the US page keeps the locked global claims", () => {
  const src = fs.readFileSync(PAGE, "utf8");
  assert.match(src, /never pull your credit/, "missing the credit claim");
  assert.match(src, /\$10K to \$100M\+/, "missing the amount range");
  assert.ok(!/\bAPR\b|guaranteed approval|pre-approved|approval rate/i.test(src), "US page carries a banned claim");
});

test("the US page is in the sitemap", () => {
  const xml = fs.readFileSync("client/public/sitemap.xml", "utf8");
  assert.match(xml, /<loc>https:\/\/www\.boreal\.financial\/us<\/loc>/, "/us missing from sitemap");
});
