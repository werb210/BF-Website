// BF_WEBSITE_REFERRAL_LANDING_v1
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";

const root = path.resolve(__dirname, "../..");
const r = (p: string) => fs.readFileSync(path.resolve(root, p), "utf8");

const page = r("pages/ReferralLanding.tsx");
const router = r("router/AppRouter.tsx");

describe("referral landing pages", () => {
  it("router mounts the funding and both landing routes", () => {
    assert.match(router, /path="\/r\/f\/:code"/);
    assert.match(router, /path="\/r\/b\/:code"/);
    assert.match(router, /ReferralLanding/);
  });

  it("appends the ref code to Apply now links", () => {
    assert.match(page, /ref=/);
    assert.match(page, /client\.boreal\.financial/);
    assert.match(page, /boreal\.insure\/applications\/new/);
  });

  it("both variant shows funding and PGI; funding variant shows funding only", () => {
    assert.match(page, /PgiCard/);
    assert.match(page, /FundingCard/);
    assert.match(page, /variant === "funding"/);
  });

  it("Learn more links point to the marketing sites", () => {
    assert.match(page, /https:\/\/www\.boreal\.financial\//);
    assert.match(page, /https:\/\/www\.boreal\.insure\//);
  });
});
