// BF_WEBSITE_SCHEMA_v18 - the structured data work shipped long ago but never
// rendered, because the component quietly ignored the prop. Assert on the wiring.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("the SEO component renders the schema prop it is given", () => {
  const src = fs.readFileSync("client/src/components/SEO.tsx", "utf8");
  assert.match(src, /application\/ld\+json/, "SEO renders no JSON-LD at all");
  assert.ok(
    /export default function SEO\(props: Props\)/.test(src),
    "SEO must take the whole props object, or it drops schema again",
  );
  assert.ok(
    src.indexOf("getSchema(props)") < src.indexOf("</Helmet>"),
    "schema must be resolved and rendered inside Helmet",
  );
});

test("pages that pass schema still do", () => {
  for (const f of ["client/src/pages/Home.tsx", "client/src/pages/ProductDetail.tsx"]) {
    assert.match(fs.readFileSync(f, "utf8"), /schema=\{/, `${f} stopped passing schema`);
  }
});

test("the dead structured-data module is gone", () => {
  assert.ok(!fs.existsSync("client/src/seo/structuredData.ts"), "the unimported duplicate is back");
});

test("login pages carry no placeholder copy and use the brand system", () => {
  for (const f of ["client/src/pages/StaffLogin.tsx", "client/src/pages/PartnerLogin.tsx"]) {
    const src = fs.readFileSync(f, "utf8");
    assert.ok(!/demo build/i.test(src), `${f} still says \"demo build\"`);
    assert.ok(!/bg-slate-900/.test(src), `${f} is still on the old dark styling`);
    assert.match(src, /font-display/, `${f} does not use the display face`);
    assert.match(src, /noindex/, `${f} should not be indexed`);
  }
  assert.match(
    fs.readFileSync("client/src/pages/StaffLogin.tsx", "utf8"),
    /https:\/\/staff\.boreal\.financial/,
    "staff login has no destination",
  );
});
