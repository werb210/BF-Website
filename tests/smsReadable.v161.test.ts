// BF_WEBSITE_SMS_READABLE_v161
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("the /sms page has its own white background like Privacy and Terms", () => {
  const sms = readFileSync("client/src/pages/SmsInfo.tsx", "utf8");
  assert.match(sms, /<main className="bg-white font-sans text-boreal-ink">/);
  assert.ok(sms.split("</main>")[0].trimEnd().endsWith("</div>"), "white panel closes after the content");
});
