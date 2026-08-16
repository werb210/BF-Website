import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const PUBLIC_DIR = "client/public";

test("sitemap ships from client/public on the canonical www host", () => {
  const xml = fs.readFileSync(`${PUBLIC_DIR}/sitemap.xml`, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(locs.length >= 30, `expected 30+ sitemap URLs, found ${locs.length}`);
  for (const loc of locs) {
    assert.ok(loc.startsWith("https://www.boreal.financial"), `off-domain sitemap URL: ${loc}`);
  }
});

test("build does not regenerate the sitemap", () => {
  const cfg = fs.readFileSync("vite.config.ts", "utf8");
  assert.ok(!/^\s*import .*from "vite-plugin-sitemap"/m.test(cfg));
});

test("the committed sitemap matches the generator exactly", async () => {
  const mod = await import("../scripts/generate-sitemap.ts");
  const committed = fs.readFileSync(`${PUBLIC_DIR}/sitemap.xml`, "utf8");
  const lastmod = committed.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/)?.[1];
  assert.ok(lastmod, "sitemap has no lastmod");
  assert.equal(
    committed,
    mod.buildSitemap(lastmod as string),
    "client/public/sitemap.xml has drifted from scripts/generate-sitemap.ts",
  );
  assert.ok(mod.ROUTES.length >= 30, `generator lists only ${mod.ROUTES.length} routes`);
});

test("llms.txt has an H1 and links", () => {
  const txt = fs.readFileSync(`${PUBLIC_DIR}/llms.txt`, "utf8");
  assert.match(txt, /^# .+/m);
  assert.ok([...txt.matchAll(/\[[^\]]+\]\(https?:\/\/[^)]+\)/g)].length >= 5);
});

test("fonts are non-blocking, Lucky Orange is gone, and API is preconnected", () => {
  const html = fs.readFileSync("client/index.html", "utf8");
  const rendered = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");
  assert.ok(!/<link(?![^>]*media=)[^>]*fonts\.googleapis\.com[^>]*rel="stylesheet"/.test(rendered));
  assert.ok(!/luckyorange/i.test(html));
  assert.match(html, /href="https:\/\/server\.boreal\.financial"/);
});

test("the empty GTM container is gone and GA4 loads once", () => {
  const html = fs.readFileSync("client/index.html", "utf8");
  assert.ok(!/GTM-TQPDWWJ3/.test(html), "the empty GTM container is back in index.html");

  const ga = fs.readFileSync("client/src/analytics/ga.ts", "utf8");
  assert.ok(
    !/googletagmanager\.com\/gtag\/js/.test(ga),
    "ga.ts injects a second gtag script again - that is the duplicate load",
  );
  assert.ok(
    /G-D1Y4105RXP/.test(ga),
    "ga.ts must use G-D1Y4105RXP - the GA4 property Todd owns and administers",
  );
  assert.ok(!/G-T6LN8Y3L3Z/.test(ga), "ga.ts points at the third-party property again");
});

test("canonical host is www everywhere", () => {
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) return e.name === "node_modules" ? [] : walk(p);
      return /\.(ts|tsx)$/.test(e.name) ? [p] : [];
    });
  const offenders = walk("client/src").filter((f) =>
    /https:\/\/(?!www\.)boreal\.financial/.test(fs.readFileSync(f, "utf8")),
  );
  assert.deepEqual(offenders, [], `bare apex URL found in: ${offenders.join(", ")}`);

  for (const f of ["client/public/sitemap.xml", "client/public/robots.txt", "client/public/llms.txt"]) {
    const body = fs.readFileSync(f, "utf8");
    assert.ok(
      !/https:\/\/(?!www\.)boreal\.financial/.test(body),
      `${f} still points at the unmapped apex host`,
    );
  }
});
