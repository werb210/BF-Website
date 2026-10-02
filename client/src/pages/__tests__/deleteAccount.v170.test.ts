// BF_WEBSITE_DELETE_ACCOUNT_v170 + BF_WEBSITE_CONSENT_HANDOFF_v170 + BF_WEBSITE_PRIVACY_MATCHED_AUDIENCES_v170
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";

const root = path.resolve(__dirname, "../..");
const r = (p: string) => fs.readFileSync(path.resolve(root, p), "utf8");

describe("delete-account page (Google Play)", () => {
  const page = r("pages/DeleteAccount.tsx");
  it("is routed at /delete-account", () => {
    assert.match(r("router/AppRouter.tsx"), /path="\/delete-account" component=\{DeleteAccount\}/);
  });
  it("names the app, gives in-app steps and an email route", () => {
    assert.match(page, /Boreal Financial app/);
    assert.match(page, /Delete account/);
    assert.match(page, /Delete my account/);
    assert.match(page, /info@boreal\.financial/);
  });
  it("says what is deleted, what is kept and for how long", () => {
    assert.match(page, /What is deleted/);
    assert.match(page, /What is kept, and for how long/);
    assert.match(page, /only for as long as the law requires/);
  });
});

describe("privacy policy", () => {
  it("discloses hashed contact details shared with Google", () => {
    const p = r("pages/privacy.tsx");
    assert.match(p, /hashed/);
    assert.match(p, /share your email address and phone number with Google/);
  });
});

describe("consent handoff to the client app", () => {
  it("adds ?consent= only when the visitor has chosen", async () => {
    const store: Record<string, string> = {};
    const g = globalThis as unknown as { window?: unknown };
    g.window = { localStorage: { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => { store[k] = v; } } };
    const { addConsentParam, buildApplyUrl } = await import("../../utils/session");
    const u1 = new URL("https://client.boreal.financial/");
    addConsentParam(u1);
    assert.equal(u1.searchParams.get("consent"), null);
    store["boreal_consent_v1"] = "denied";
    const u2 = new URL("https://client.boreal.financial/");
    addConsentParam(u2);
    assert.equal(u2.searchParams.get("consent"), "denied");
    store["boreal_consent_v1"] = "granted";
    assert.match(buildApplyUrl("https://client.boreal.financial/"), /consent=granted/);
    delete g.window;
  });
  it("the Apply-link click handler adds it too", () => {
    assert.match(r("main.tsx"), /addConsentParam\(url\); \/\/ BF_WEBSITE_CONSENT_HANDOFF_v170/);
  });
});
