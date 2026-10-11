// BF_WEBSITE_v789_SW_BUILD_HASH - post-build step (npm run build).
// Replaces the __BF_BUILD_HASH__ placeholder in dist/sw.js with a hash of
// everything else in dist, so the service worker's cache names change with
// every deploy that changes any file, and only then.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const SW_PLACEHOLDER = "__BF_BUILD_HASH__";

function listFiles(dir: string, root = dir): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => {
      const full = path.join(dir, e.name);
      return e.isDirectory() ? listFiles(full, root) : [path.relative(root, full).split(path.sep).join("/")];
    })
    .sort();
}

export function buildHash(distDir: string): string {
  const h = createHash("sha256");
  for (const rel of listFiles(distDir)) {
    if (rel === "sw.js") continue;
    h.update(rel);
    h.update("\0");
    h.update(fs.readFileSync(path.join(distDir, rel)));
    h.update("\0");
  }
  return h.digest("hex").slice(0, 16);
}

export function stampServiceWorker(source: string, hash: string): string {
  if (!source.includes(SW_PLACEHOLDER)) throw new Error(`sw.js has no ${SW_PLACEHOLDER} placeholder`);
  if (!/^[0-9a-f]{8,64}$/.test(hash)) throw new Error(`not a build hash: ${hash}`);
  return source.split(SW_PLACEHOLDER).join(hash);
}

if (process.argv[1] && process.argv[1].includes("stamp-sw")) {
  const dist = path.resolve("dist");
  const swPath = path.join(dist, "sw.js");
  const hash = buildHash(dist);
  fs.writeFileSync(swPath, stampServiceWorker(fs.readFileSync(swPath, "utf8"), hash));
  console.log(`stamp-sw: sw.js VERSION = ${hash}`);
}
