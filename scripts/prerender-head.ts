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

// BF_WEBSITE_STATIC_POLICIES_v1 - /privacy and /terms also get their full text inside <div id="root">, rendered with
// React on the server, so carrier and app-store vetting tools that do not run JavaScript can read the policies.
// The app mounts with createRoot, which replaces this markup with the same page once the script runs.
export const STATIC_BODY_ROUTES = ["/privacy", "/terms"];

export function injectBody(html: string, markup: string): string {
  if (!html.includes('<div id="root"></div>')) throw new Error('index.html has no empty <div id="root"></div>');
  return html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
}

export async function prerenderPolicyBodies(distDir: string): Promise<string[]> {
  const { createServer } = await import("vite");
  const vite = await createServer({
    configFile: path.resolve("vite.config.ts"),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "error",
    optimizeDeps: { noDiscovery: true, include: [] },
    ssr: { noExternal: ["react-helmet-async"] },
  });
  const written: string[] = [];
  try {
    const mod = (await vite.ssrLoadModule("/src/ssr/policyPages.tsx")) as {
      renderPolicyPage: (route: string) => string | null;
    };
    for (const route of STATIC_BODY_ROUTES) {
      const markup = mod.renderPolicyPage(route);
      if (!markup || markup.replace(/<[^>]+>/g, " ").trim().length < 1000) {
        throw new Error(`prerender-head: ${route} rendered too little text to be the real policy`);
      }
      const out = outputPathFor(distDir, route);
      fs.writeFileSync(out, injectBody(fs.readFileSync(out, "utf8"), markup));
      written.push(out);
    }
  } finally {
    await vite.close();
  }
  return written;
}

if (process.argv[1] && process.argv[1].includes("prerender-head")) {
  const distDir = path.resolve("dist");
  const written = prerenderHeads(distDir);
  console.log(`prerender-head: wrote head tags for ${written.length} routes`);
  const bodies = await prerenderPolicyBodies(distDir);
  console.log(`prerender-head: wrote full page text for ${bodies.length} policy pages`);
}
