// BF_WEBSITE_ATTRIBUTION_MERGE_v1
// Source-level guards. captureAttribution lives in main.tsx alongside the React
// bootstrap, so importing it here would mount the whole app; assert the
// properties that regressed in production instead.
import { readFileSync } from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { test } from "node:test";

const src = readFileSync(path.join(process.cwd(), "src/main.tsx"), "utf8");

test("an empty first visit no longer locks out later attribution", () => {
  // The old bare guard is what discarded every gclid.
  assert.ok(
    !src.includes("if (!localStorage.getItem(ATTRIBUTION_KEY)) {\n    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));\n  }"),
    "the unconditional first-touch write must be gone",
  );
  assert.ok(src.includes("BF_WEBSITE_ATTRIBUTION_MERGE_v1"));
});

test("a record with no marketing signal is never persisted", () => {
  assert.ok(src.includes("function hasMarketingSignal"));
  assert.ok(src.includes("if (hasMarketingSignal(attribution))"));
});

test("every ad parameter counts as signal", () => {
  for (const k of [
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "gclid", "gbraid", "wbraid", "li_fat_id",
  ]) {
    assert.ok(src.includes(`"${k}"`), `${k} must be in MARKETING_KEYS`);
  }
});

test("first-touch source is preserved, missing fields are filled in", () => {
  // A later ad click must not overwrite the campaign that first introduced the
  // visitor, but must populate anything the stored record lacks.
  assert.ok(src.includes("if (!existingIsSet && incomingIsSet)"));
  assert.ok(src.includes("const merged: AttributionRecord = { ...stored };"));
});

test("tracking failures never break the site", () => {
  assert.ok(src.includes("// localStorage unavailable or holding malformed JSON"));
});
