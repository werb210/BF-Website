// BF_WEBSITE_SCHEMA_v21 - v18 asserted the source read the prop, which it did,
// while Helmet dropped the array and shipped nothing. Assert the shape Helmet
// can actually render.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const SRC = fs.readFileSync("client/src/components/SEO.tsx", "utf8");

test("schema is a single Helmet child, not a mapped array", () => {
  assert.match(SRC, /application\/ld\+json/, "no JSON-LD emitted");
  assert.ok(
    !/schemaBlocks\.map/.test(SRC),
    "schema is mapped to an array again - react-helmet-async drops array children",
  );
  assert.ok(
    SRC.includes("JSON.stringify(schemaBlocks.length === 1 ? schemaBlocks[0] : schemaBlocks)"),
    "multiple schema blocks must serialise into one JSON array",
  );
});

test("no other Helmet child is a mapped array", () => {
  const helmet = SRC.slice(SRC.indexOf("<Helmet>"), SRC.indexOf("</Helmet>"));
  assert.ok(!/\.map\(/.test(helmet), "a mapped array inside Helmet will be dropped silently");
});

test("the contact phone field validates a real number", () => {
  const form = fs.readFileSync("client/src/components/ContactForm.tsx", "utf8");
  assert.match(form, /pattern="\[\^0-9\]/, "phone field accepts any non-empty string");
});

test("reassurance copy under the CTA is not 12px", () => {
  for (const f of ["client/src/pages/Home.tsx", "client/src/pages/UnitedStates.tsx"]) {
    const src = fs.readFileSync(f, "utf8");
    assert.ok(
      !/No cost, no obligation[^<]*<\/p>/.test(src) || !/text-xs[^"]*"[^>]*>\s*No cost/.test(src),
      `${f} still renders the cost line at 12px`,
    );
  }
});
