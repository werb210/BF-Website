// BF_WEBSITE_SITE_BEHAVIOUR_v169
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const SRC = fs.readFileSync("client/src/utils/siteBehaviour.ts", "utf8");

test("records clicks, CTAs seen, sections, scroll and forms", () => {
  for (const type of ["\"click\"", "\"cta_view\"", "\"section_view\"", "\"scroll\"", "\"form_start\"", "\"field_complete\"", "\"form_submit\"", "\"form_abandon\""]) {
    assert.ok(SRC.includes(type), "missing event " + type);
  }
});

test("never records what a visitor types", () => {
  assert.ok(!/\.value\b/.test(SRC), "field values must never be read");
});

test("is started at boot and on every route change", () => {
  assert.ok(fs.readFileSync("client/src/main.tsx", "utf8").includes("initSiteBehaviour();"));
  assert.ok(fs.readFileSync("client/src/components/ScrollToTop.tsx", "utf8").includes("siteBehaviourPage(pathname);"));
});

test("scroll depth marks 25, 50, 75 and 100 percent", () => {
  assert.ok(SRC.includes("[25, 50, 75, 100].filter((d) => pct >= d)"));
});

test("the privacy policy discloses it", () => {
  const policy = fs.readFileSync("client/src/pages/privacy.tsx", "utf8");
  assert.ok(policy.includes("never what you type in them"));
});
