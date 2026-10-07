// BF_WEBSITE_LEGAL_NAME_v179
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p: string) => readFileSync(p, "utf8");

describe("legal pages name the real company and a fixed date", () => {
  it("privacy policy and texting page use 2630108 Alberta Ltd., never Boreal Financial Corp.", () => {
    for (const p of ["src/pages/privacy.tsx", "src/pages/SmsInfo.tsx", "src/pages/TermsPage.tsx"]) {
      const s = read(p);
      assert.equal(s.includes("Boreal Financial Corp"), false, p);
      assert.equal(s.includes("2630108 Alberta Ltd."), true, p);
    }
  });
  it("terms of service shows a fixed last-updated date, not today's", () => {
    const s = read("src/pages/TermsPage.tsx");
    assert.equal(s.includes("new Date().toISOString().slice(0, 10)"), false);
    assert.equal(s.includes("Last updated: October 7, 2026"), true);
  });
});
