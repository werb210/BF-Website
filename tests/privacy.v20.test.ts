// BF_WEBSITE_PRIVACY_v20 - the policy shipped for months as two sentences that
// disclosed none of the tracking actually running on the site.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const SRC = fs.readFileSync("client/src/pages/privacy.tsx", "utf8");

test("the policy discloses what the site actually runs", () => {
  for (const term of [
    "Google Ads",
    "remarketing",
    "Google Analytics 4",
    "Microsoft Clarity",
    "Consent Mode",
    "click identifier",
  ]) {
    assert.ok(SRC.includes(term), `privacy policy never mentions ${term}`);
  }
});

test("it identifies the company and gives a route to complain", () => {
  assert.ok(SRC.includes("Boreal Financial Corp."), "legal name missing");
  assert.ok(SRC.includes("Edmonton, AB"), "mailing address missing");
  assert.ok(SRC.includes("info@boreal.financial"), "contact address missing");
  assert.ok(
    SRC.includes("Privacy Commissioner of Canada"),
    "no regulator named for complaints",
  );
});

test("it keeps the locked credit claim accurate", () => {
  assert.ok(
    SRC.includes("We do not obtain a consumer credit report"),
    "the credit-check position is missing or reworded",
  );
});

test("the legal name matches the CASL identification on /sms", () => {
  const sms = fs.readFileSync("client/src/pages/SmsInfo.tsx", "utf8");
  const name = sms.match(/const LEGAL_NAME = "([^"]+)"/)?.[1];
  assert.equal(name, "Boreal Financial Corp.", "CASL legal name changed");
  assert.ok(SRC.includes(name as string), "privacy policy contradicts /sms");
});

test("no placeholder text reaches production", () => {
  assert.ok(!/\[[A-Z][A-Z ]+\]/.test(SRC), "an unfilled placeholder is still in the page");
  assert.ok(
    !/\[Placeholder/i.test(SRC),
    "a bracketed placeholder marker is still in the privacy page",
  );
});
