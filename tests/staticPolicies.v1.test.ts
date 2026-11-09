// BF_WEBSITE_STATIC_POLICIES_v1 - /privacy and /terms must carry the full policy text in the built HTML, because
// Twilio's RCS / toll-free vetting, Apple and Google read the raw page without running JavaScript.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { injectBody, prerenderPolicyBodies, STATIC_BODY_ROUTES } from "../scripts/prerender-head.ts";

test("injectBody puts the markup inside the empty root div", () => {
  const html = '<html><head><title>x</title></head><body><div id="root"></div></body></html>';
  assert.equal(injectBody(html, "<h1>Privacy</h1>"), '<html><head><title>x</title></head><body><div id="root"><h1>Privacy</h1></div></body></html>');
  assert.throws(() => injectBody("<div id=\"root\">already</div>", "x"));
});

test("privacy and terms are both statically rendered", () => {
  assert.deepEqual(STATIC_BODY_ROUTES, ["/privacy", "/terms"]);
});

test("the rendered policies contain the real text", { timeout: 120000 }, async () => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), "bf-policies-"));
  for (const r of STATIC_BODY_ROUTES) {
    fs.mkdirSync(path.join(dist, r.slice(1)), { recursive: true });
    fs.writeFileSync(path.join(dist, r.slice(1), "index.html"), '<html><head><title>t</title></head><body><div id="root"></div></body></html>');
  }
  await prerenderPolicyBodies(dist);
  const text = (r: string) => fs.readFileSync(path.join(dist, r.slice(1), "index.html"), "utf8").replace(/<[^>]+>/g, " ");
  assert.match(text("/privacy"), /2630108 Alberta Ltd/);
  assert.match(text("/privacy"), /What we collect/);
  assert.match(text("/terms"), /Service description/);
});
