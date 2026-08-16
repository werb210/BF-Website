import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const PUBLIC_DIR = "client/public";

test("sitemap ships from client/public on the canonical apex domain", () => {
  const xml = fs.readFileSync(`${PUBLIC_DIR}/sitemap.xml`, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(locs.length >= 30, `expected 30+ sitemap URLs, found ${locs.length}`);
  for (const loc of locs) {
    assert.ok(loc.startsWith("https://boreal.financial"), `off-domain sitemap URL: ${loc}`);
  }
});

test("build does not regenerate the sitemap", () => {
  const cfg = fs.readFileSync("vite.config.ts", "utf8");
  assert.ok(!/^\s*import .*from "vite-plugin-sitemap"/m.test(cfg));
});

test("sitemap generator writes the deployed file", () => {
  const gen = fs.readFileSync("scripts/generate-sitemap.ts", "utf8");
  assert.ok(gen.includes('"client/public/sitemap.xml"'));
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

test("no source file points at the www host", () => {
  const walk = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return entry.name === "node_modules" ? [] : walk(path);
    return /\.(ts|tsx|html)$/.test(entry.name) ? [path] : [];
  });
  const offenders = [...walk("client/src"), "client/index.html"].filter((file) =>
    fs.readFileSync(file, "utf8").includes("www.boreal.financial"),
  );
  assert.deepEqual(offenders, []);
});
