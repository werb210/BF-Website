// BF_WEBSITE_LEGAL_NAME_v167
// Twilio toll-free verification is registered to 2630108 Alberta Ltd. The site must show that Boreal
// Financial is that company's trade name, so reviewers can match the business to the website.
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("footer and Terms name the legal entity behind Boreal Financial", () => {
  const footer = readFileSync("client/src/components/footer.tsx", "utf8");
  assert.match(footer, /Boreal Financial, a trade name of 2630108 Alberta Ltd\./);
  const terms = readFileSync("client/src/pages/TermsPage.tsx", "utf8");
  assert.match(terms, /Boreal Financial is a trade name of 2630108 Alberta Ltd\., a commercial financing broker/);
});
