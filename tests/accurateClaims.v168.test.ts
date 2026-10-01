// BF_WEBSITE_ACCURATE_CLAIMS_v168
// Todd 2026-10-01: Boreal never pulls credit, lenders do (with permission); 3-4 day funding is the
// fastest case (clean file, small term loan), not typical. Pages must say exactly that.
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const pages = ["Home", "HowItWorks", "UnitedStates", "CreditResults", "FAQ", "privacy"].map((f) => readFileSync("client/src/pages/" + f + ".tsx", "utf8"));
const all = pages.join("\n") + readFileSync("client/src/data/productContent.ts", "utf8");

test("speed is stated as the fastest case, never as typical", () => {
  assert.doesNotMatch(all, /Typical (time to|conventional) funding/);
  assert.doesNotMatch(all, /(Most|most) (complete |conventional )*(applications|files) reach funding in three to four days/);
  assert.match(all, /as little as three to four days/);
});

test("credit wording: Boreal never pulls it, lenders check with permission", () => {
  assert.doesNotMatch(all, /We never pull your credit/);
  assert.doesNotMatch(all, /none from a lender until/);
  assert.doesNotMatch(all, /signed a term sheet/);
  assert.match(all, /No credit pull to apply/);
  assert.match(all, /A lender checks it only with your permission/);
});
