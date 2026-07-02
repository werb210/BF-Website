import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
const page = readFileSync(join(process.cwd(), "src", "pages", "SmsInfo.tsx"), "utf-8");
const router = readFileSync(join(process.cwd(), "src", "router", "AppRouter.tsx"), "utf-8");
describe("CASL SMS info page", () => {
  it("carries identification + opt-out mechanics", () => {
    expect(page).toContain("MAILING_ADDRESS");
    expect(page).toContain("STOP");
    expect(page).toContain("START");
    expect(page).toContain("info@boreal.financial");
  });
  it("is routed at /sms", () => {
    expect(router).toContain('path="/sms"');
    expect(router).toContain("SmsInfo");
  });
});
