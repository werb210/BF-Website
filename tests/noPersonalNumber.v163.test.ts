// BF_WEBSITE_NO_PERSONAL_NUMBER_v163
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("no personal cell number in the website server; lead alerts use LEAD_ALERT_SMS_TO", () => {
  for (const f of ["server/routes.ts", "server/routes/contact.ts"]) {
    assert.doesNotMatch(readFileSync(f, "utf8"), /587.?888.?1837/, f);
  }
  assert.match(readFileSync("server/routes/contact.ts", "utf8"), /process\.env\.LEAD_ALERT_SMS_TO/);
});
