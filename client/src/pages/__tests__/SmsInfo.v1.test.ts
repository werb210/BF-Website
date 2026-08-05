// BF_WEBSITE_NODE22_TEST_DISCOVERY_v3
// This file imported from "vitest", which is not a dependency of this repo and
// never has been. Under Node 20 the built-in runner's default file discovery
// did not reach client/src/pages/__tests__, so `tsx --test` never collected it
// and the failure was invisible. Node 22 widened that discovery and the missing
// import became a hard CI failure. It also read src/pages/SmsInfo.tsx relative
// to cwd, but npm test runs from the repo root where the file is under client/,
// so it would have thrown even with vitest installed. Converted to node:test to
// match tests/*.test.ts, and the paths corrected - it now runs for the first time.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const page = readFileSync(join(process.cwd(), "client", "src", "pages", "SmsInfo.tsx"), "utf-8");
const router = readFileSync(join(process.cwd(), "client", "src", "router", "AppRouter.tsx"), "utf-8");

describe("CASL SMS info page", () => {
  it("carries identification + opt-out mechanics", () => {
    for (const needle of ["MAILING_ADDRESS", "STOP", "START", "info@boreal.financial"]) {
      assert.ok(page.includes(needle), `SmsInfo.tsx is missing ${needle}`);
    }
  });

  it("is routed at /sms", () => {
    assert.ok(router.includes('path="/sms"'), "AppRouter.tsx does not route /sms");
    assert.ok(router.includes("SmsInfo"), "AppRouter.tsx does not reference SmsInfo");
  });
});
