// BF_WEBSITE_CRE_v23 - Boreal does not place commercial real estate. It had a
// detail page, a homepage card, a /us card, a comparison row, two industry
// suggestions and a sitemap entry. None of it should come back.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) return e.name === "node_modules" ? [] : walk(p);
    return /\.(ts|tsx)$/.test(e.name) ? [p] : [];
  });

test("no source file offers commercial real estate", () => {
  const offenders = walk("client/src").filter((f) =>
    /commercial-real-estate/i.test(fs.readFileSync(f, "utf8")),
  );
  assert.deepEqual(offenders, [], `commercial real estate found in: ${offenders.join(", ")}`);
});

test("it is not a route in the sitemap", () => {
  const xml = fs.readFileSync("client/public/sitemap.xml", "utf8");
  assert.ok(!/commercial-real-estate/.test(xml), "sitemap still lists the CRE page");

  const gen = fs.readFileSync("scripts/generate-sitemap.ts", "utf8");
  assert.ok(!/commercial-real-estate/.test(gen), "sitemap generator still lists the CRE route");
});

test("the FAQ no longer cites it for timing", () => {
  const faq = fs.readFileSync("client/src/pages/FAQ.tsx", "utf8");
  assert.ok(!/Commercial real estate/i.test(faq), "FAQ still mentions commercial real estate");
});
