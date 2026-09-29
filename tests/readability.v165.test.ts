// BF_WEBSITE_READABILITY_v165
// Every piece of text must be readable. A browser audit (desktop and phone, pixels measured behind
// each text element) found brand gold #BF9B49 used as text on white and light-grey sections (2.5:1),
// green and mid-gold links under 4.5:1, and pale grey small print on a white card. Gold text on
// light surfaces now uses boreal.goldInk; bright gold stays on dark sections, where it reads well.
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h: string) => {
  const [r, g, b] = hex(h).map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const cfg = readFileSync("tailwind.config.ts", "utf8");
const token = (name: string) => cfg.match(new RegExp(name + ': *"(#[0-9A-Fa-f]{6})"'))![1];

test("light-surface text colours meet WCAG AA", () => {
  for (const bg of ["#FFFFFF", token("mist")]) {
    assert.ok(ratio(token("goldInk"), bg) >= 4.5, "goldInk on " + bg);
    assert.ok(ratio(token("body"), bg) >= 4.5, "body on " + bg);
    assert.ok(ratio("#15803d", bg) >= 4.5, "fit green on " + bg);
  }
  assert.ok(ratio(token("gold"), token("ink")) >= 4.5, "bright gold stays for dark sections");
});

test("gold text on white sections uses goldInk", () => {
  const read = (f: string) => readFileSync("client/src/pages/" + f, "utf8");
  const pd = read("ProductDetail.tsx");
  assert.match(pd, /const eyebrow = "[^"]*text-boreal-goldInk"/);
  assert.match(pd, /text-boreal-goldInk">Step/);
  assert.doesNotMatch(pd, /2f9e5b/);
  for (const f of ["Home.tsx", "UnitedStates.tsx"]) {
    const s = read(f);
    assert.ok(s.includes('<b className="text-boreal-goldInk">✓</b>'), f);
    assert.ok(!s.includes("96a3b8"), f);
  }
  const pages = readdirSync("client/src/pages").filter((f) => f.endsWith(".tsx"));
  for (const f of pages) assert.doesNotMatch(read(f), /text-boreal-goldDeep/, f + " uses the 3.9:1 mid gold for text");
});
