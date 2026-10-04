// BF_WEBSITE_ALBERTA_TIME_v175
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("the booking page shows Alberta time as UTC-6 all year", () => {
  const page = readFileSync("client/src/pages/Book.tsx", "utf8");
  assert.ok(page.includes('const TZ = "America/Regina";'));
  assert.ok(!page.includes("America/Edmonton"));
  assert.ok(!page.includes("Mountain time"));
  const shown = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Regina", hour: "numeric", minute: "2-digit" }).format(new Date("2026-12-07T15:00:00Z"));
  assert.match(shown, /^9:00/);
});
