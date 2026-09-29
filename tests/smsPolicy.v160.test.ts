// BF_WEBSITE_SMS_POLICY_v160
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("privacy, terms and the /sms page carry the text-messaging disclosures", () => {
  const privacy = readFileSync("client/src/pages/privacy.tsx", "utf8");
  const terms = readFileSync("client/src/pages/TermsPage.tsx", "utf8");
  const sms = readFileSync("client/src/pages/SmsInfo.tsx", "utf8");
  for (const s of [privacy, terms, sms]) {
    assert.match(s, /Up to 10 messages per month/);
    assert.match(s, /STOP/);
    assert.match(s, /HELP/);
    assert.doesNotMatch(s, /Boreal Insurance/);
  }
  assert.match(privacy, /do not share, sell or rent your mobile number/);
  assert.match(sms, /How you opt in/);
});
