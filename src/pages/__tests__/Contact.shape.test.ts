// BF_WEBSITE_CONTACT_PATH_v53 — guard against future regressions of either
// the path or the camelCase field names that BF-Server's submitContactForm
// requires. Reads the source file directly (no DOM simulation needed).
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SRC = readFileSync(resolve(__dirname, "..", "Contact.tsx"), "utf8");

describe("BF_WEBSITE_CONTACT_PATH_v53", () => {
  it("posts to /api/website/contact (NOT /api/website-leads)", () => {
    expect(SRC).toContain('"/api/website/contact"');
    expect(SRC).not.toContain('"/api/website-leads"');
  });
  it("uses camelCase field names that match submitContactForm", () => {
    expect(SRC).toMatch(/companyName:\s*form\.company/);
    expect(SRC).toMatch(/fullName:\s*form\.name/);
    expect(SRC).not.toMatch(/company_name:/);
  });
});
