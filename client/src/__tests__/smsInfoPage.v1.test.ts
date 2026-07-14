// BF_WEBSITE_SWA_CONFIG_v1 + BF_WEBSITE_SMS_ADDRESS_v1
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const inPublic = path.join(process.cwd(), "client/public/staticwebapp.config.json");
const smsPage = readFileSync(path.join(process.cwd(), "src/pages/SmsInfo.tsx"), "utf8");
const router = readFileSync(path.join(process.cwd(), "src/router/AppRouter.tsx"), "utf8");

describe("Azure SWA config reaches the deployed build", () => {
  it("lives in publicDir so Vite copies it into dist/", () => {
    // It was at the repo root only. output_location is "dist", so Azure never saw it and
    // navigationFallback was absent in production -- hard 404 on every deep link.
    assert.equal(existsSync(inPublic), true);
  });

  it("still rewrites unknown paths to index.html", () => {
    const cfg = JSON.parse(readFileSync(inPublic, "utf8"));
    assert.equal(cfg.navigationFallback?.rewrite, "/index.html");
  });

  it("still carries the /refer redirect, which was dead for the same reason", () => {
    const cfg = JSON.parse(readFileSync(inPublic, "utf8"));
    assert.equal(cfg.routes?.some((r: { route?: string }) => r.route === "/refer"), true);
  });

  it("matches the repo-root copy so the two cannot drift", () => {
    const root = readFileSync(path.join(process.cwd(), "staticwebapp.config.json"), "utf8");
    assert.deepEqual(JSON.parse(readFileSync(inPublic, "utf8")), JSON.parse(root));
  });
});

describe("/sms is the CASL identification page every SMS footer links to", () => {
  it("is routed", () => {
    assert.equal(router.includes('path="/sms"'), true);
  });

  it("shows a real mailing address, not the placeholder", () => {
    assert.equal(smsPage.includes("REGISTERED MAILING ADDRESS REQUIRED"), false);
    assert.equal(smsPage.includes("450 Sparling Crt SW, Edmonton, AB T6X 1G9"), true);
  });

  it("carries the identification CASL requires", () => {
    assert.equal(smsPage.includes("Boreal Financial Corp."), true);
    assert.equal(smsPage.includes("info@boreal.financial"), true);
  });

  it("explains opt-out, timing, and rates", () => {
    assert.equal(smsPage.includes("STOP"), true);
    assert.equal(smsPage.includes("START"), true);
    assert.equal(smsPage.includes("10 business days"), true);
    assert.equal(smsPage.includes("Message and data rates may apply"), true);
  });
});
