// BF_WEBSITE_v789_ROUTE_META - post-build step (npm run build).
// The site is a client-rendered SPA: every URL used to get the same
// dist/index.html, so crawlers and link previews that do not run JavaScript
// saw the home page title, description and no canonical on every page.
// For each sitemap route this writes dist/<route>/index.html: the built
// index.html with that route's title, description, canonical and Open Graph
// tags already in <head>. The tags carry data-rh="true" so react-helmet-async
// takes them over in the browser instead of adding duplicates.
import fs from "node:fs";
import path from "node:path";
import { ROUTES } from "./generate-sitemap.ts";
import * as routeMetaModule from "../client/src/seo/routeMeta.ts";
import type { RouteMeta } from "../client/src/seo/routeMeta.ts";

// client/ has its own package.json without "type": "module", so node loads
// routeMeta.ts as CommonJS; its exports arrive on the namespace's default.
const { routeMetaFor } =
  (routeMetaModule as unknown as { default?: typeof routeMetaModule }).default ?? routeMetaModule;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderHeadTags(meta: RouteMeta): string {
  const tags = [
    `<meta data-rh="true" name="description" content="${escapeHtml(meta.description)}" />`,
    `<link data-rh="true" rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    `<meta data-rh="true" property="og:type" content="website" />`,
    `<meta data-rh="true" property="og:title" content="${escapeHtml(meta.ogTitle)}" />`,
    `<meta data-rh="true" property="og:description" content="${escapeHtml(meta.ogDescription)}" />`,
    `<meta data-rh="true" property="og:image" content="${escapeHtml(meta.ogImage)}" />`,
    `<meta data-rh="true" property="og:url" content="${escapeHtml(meta.canonical)}" />`,
  ];
  return tags.map((t) => `    ${t}`).join("\n");
}

export function applyHead(template: string, meta: RouteMeta): string {
  if (!/<title>[\s\S]*?<\/title>/.test(template)) throw new Error("index.html has no <title>");
  if (!template.includes("</head>")) throw new Error("index.html has no </head>");
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    // the generic description shipped in index.html
    .replace(/[ \t]*<meta\s+data-rh="true"\s+name="description"[\s\S]*?\/>\n?/, "")
    .replace(/\s*<\/head>/, `\n${renderHeadTags(meta)}\n  </head>`);
}

export function outputPathFor(distDir: string, route: string): string {
  return route === "/" ? path.join(distDir, "index.html") : path.join(distDir, route.replace(/^\//, ""), "index.html");
}

export function prerenderHeads(distDir: string, routes: string[] = ROUTES): string[] {
  const template = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
  const missing = routes.filter((r) => !routeMetaFor(r));
  if (missing.length) {
    throw new Error(`No route meta for sitemap routes: ${missing.join(", ")} (client/src/seo/routeMeta.ts)`);
  }
  const written: string[] = [];
  for (const route of routes) {
    const out = outputPathFor(distDir, route);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, applyHead(template, routeMetaFor(route) as RouteMeta));
    written.push(out);
  }
  return written;
}

if (process.argv[1] && process.argv[1].includes("prerender-head")) {
  const written = prerenderHeads(path.resolve("dist"));
  console.log(`prerender-head: wrote head tags for ${written.length} routes`);
}
