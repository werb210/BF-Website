import fs from "node:fs";
import path from "node:path";
import { SitemapStream, streamToPromise } from "./sitemap-lib";

const BASE_URL = process.env.VITE_SITE_URL ?? "https://borealfinancial.ca";
const outputPath = path.resolve(process.cwd(), "public/sitemap.xml");

const routes = [
  "/",
  "/contact",
  "/privacy",
  "/terms",
  "/work-with-us",
  "/working-capital",
  "/line-of-credit",
  "/term-loans",
  "/purchase-order-financing",
  "/industries/construction",
  "/industries/manufacturing",
  "/industries/logistics",
];

async function run() {
  const sitemap = new SitemapStream({ hostname: BASE_URL });

  routes.forEach((url) => sitemap.write({ url }));
  sitemap.end();

  const xml = (await streamToPromise(sitemap)).toString();

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, xml, "utf8");

  console.log(`Sitemap generated for ${routes.length} routes at ${outputPath}.`);
}

void run();
