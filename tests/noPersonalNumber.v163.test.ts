// BF_WEBSITE_NO_PERSONAL_NUMBER_v163
// BF_WEBSITE_v789_NO_SERVER - the Express server under server/ was never
// deployed (Static Web Apps serves only dist) and is gone. Lead alerts are sent
// by BF-Server, so the check now covers the code that actually ships.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(tsx?|html|js|json|txt)$/.test(name) ? [full] : [];
  });
}

test("no personal cell number anywhere in the shipped site", () => {
  for (const f of [...walk("client/src"), ...walk("client/public"), "client/index.html"]) {
    assert.doesNotMatch(readFileSync(f, "utf8"), /587.?888.?1837/, f);
  }
});

test("the dead website server is gone", () => {
  assert.equal(existsSync("server"), false);
});
