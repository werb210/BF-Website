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
  for (const f of ["components/footer.tsx", "router/content.ts"]) {
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

// BF_WEBSITE_v806_TFV - Twilio rejected the 866 again under 30468. Every public page now describes a broker
// acting for the applicant: no "match", "panel", "lender network" or "marketplace" wording, the carriers'
// required no-sharing sentences word for word, a named SMS program, and no placeholder on the Terms page.
test("v806: no lead-matching wording anywhere a visitor or reviewer can read", () => {
  const files = ["pages/Home.tsx", "pages/UnitedStates.tsx", "pages/HowItWorks.tsx", "pages/FAQ.tsx", "pages/CreditResults.tsx",
    "pages/ReferralLanding.tsx", "pages/TermsPage.tsx", "pages/privacy.tsx", "pages/SmsInfo.tsx", "data/productContent.ts",
    "data/products.ts", "router/content.ts", "seo/routeMeta.ts", "lib/structured-data.ts"];
  for (const f of files) {
    const s = readFileSync("client/src/" + f, "utf8");
    assert.doesNotMatch(s, /marketplace|lender network|on our (US |Canadian )?panel|our panel|be matched|fit-matched|match (you|your|it) to/i, f);
  }
  assert.doesNotMatch(readFileSync("client/public/llms.txt", "utf8"), /marketplace|is matched/i);
});

test("v806: the carriers' SMS statements are on Privacy, Terms and /sms", () => {
  const required = [
    "No mobile information will be shared with third parties or affiliates for marketing or promotional purposes.",
    "Text messaging opt-in data and consent will not be shared with any third parties.",
  ];
  for (const f of ["pages/privacy.tsx", "pages/TermsPage.tsx"]) {
    const s = readFileSync("client/src/" + f, "utf8");
    for (const r of required) assert.ok(s.includes(r), f + " missing: " + r);
  }
  const sms = readFileSync("client/src/pages/SmsInfo.tsx", "utf8").replace(/\s+/g, " ");
  for (const r of required) assert.ok(sms.includes(r), "SmsInfo missing: " + r);
  const terms = readFileSync("client/src/pages/TermsPage.tsx", "utf8");
  assert.match(terms, /Program: Boreal Financial Application Updates/);
  assert.match(terms, /Reply STOP to opt out, HELP for help\./);
  assert.doesNotMatch(terms, /\[Placeholder/);
  assert.doesNotMatch(sms, /unsubscribe from marketing texts/);
});
