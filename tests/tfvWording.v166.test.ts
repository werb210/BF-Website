// BF_WEBSITE_TFV_WORDING_v166
// Twilio rejected toll-free verification for the 866 line (reason 30468, third-party lead generation).
// The public site described Boreal as a "marketplace" that "introduces" borrowers to lenders. Boreal is
// a broker the applicant deals with directly; these pages must not describe it as a lead marketplace.
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("public pages describe a broker, not a lead marketplace", () => {
  for (const f of ["TermsPage", "UnitedStates", "Home", "privacy", "SmsInfo"]) {
    const s = readFileSync("client/src/pages/" + f + ".tsx", "utf8");
    assert.doesNotMatch(s, /marketplace/i, f);
    assert.doesNotMatch(s, /introduces business borrowers/i, f);
  }
  for (const f of ["components/footer.tsx", "router/content.ts", "components/CompareModal.tsx", "features/comparison/ComparisonModal.tsx"]) {
    const s = readFileSync("client/src/" + f, "utf8");
    assert.doesNotMatch(s, />[^<]*marketplace[^<]*</i, f + " shows marketplace wording");
    assert.doesNotMatch(s, /lending marketplace|across the marketplace|marketplace intake/i, f);
  }
  const terms = readFileSync("client/src/pages/TermsPage.tsx", "utf8");
  assert.match(terms, /commercial financing broker/);
  assert.match(terms, /do not sell or pass on your information as a lead/);
});

test("SMS privacy promise stays in place", () => {
  const p = readFileSync("client/src/pages/privacy.tsx", "utf8");
  assert.match(p, /do not share, sell or rent your mobile number or your text-messaging consent/);
});
