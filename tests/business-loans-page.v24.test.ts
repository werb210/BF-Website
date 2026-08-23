// BF_WEBSITE_BUSINESS_LOANS_v24 - "business loans" is the most-contested term
// in the Canadian market and Boreal bid on it with nowhere to send the click.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const PRODUCTS = fs.readFileSync("client/src/data/products.ts", "utf8");
const CONTENT = fs.readFileSync("client/src/data/productContent.ts", "utf8");
const SITEMAP = fs.readFileSync("client/public/sitemap.xml", "utf8");
const GEN = fs.readFileSync("scripts/generate-sitemap.ts", "utf8");

test("the page exists as a real route", () => {
  assert.ok(PRODUCTS.includes('slug: "business-loans"'), "not in products");
  assert.ok(CONTENT.includes('slug:"business-loans"'), "no detail content");
  assert.ok(SITEMAP.includes("/products/business-loans"), "not in sitemap");
  assert.ok(GEN.includes("/products/business-loans"), "not in the sitemap generator");
});

test("it answers the query rather than inventing a product", () => {
  assert.ok(CONTENT.includes("marketplace, not a lender"), "does not state the model");
  assert.ok(PRODUCTS.includes("Boreal is not a lender"), "does not state the model");
});

test("it leads with the head term", () => {
  assert.ok(PRODUCTS.includes('name: "Business Loans"'));
  const businessLoans = PRODUCTS.indexOf('slug: "business-loans"');
  const termLoan = PRODUCTS.indexOf('slug: "term-loan"');
  assert.ok(businessLoans < termLoan, "should precede term-loan in the list");
});

test("the claims match what the rest of the site says", () => {
  assert.ok(CONTENT.includes("does not pull credit"), "credit claim missing");
  assert.ok(CONTENT.includes("paid by the lender"), "fee claim missing");
});

test("it says who it is NOT for", () => {
  assert.ok(CONTENT.includes("pre-revenue"), "no disqualifier");
});
