import fs from "node:fs"

const routes = [
  "/",
  "/term-loans",
  "/line-of-credit",
  "/equipment-financing",
  "/factoring",
  "/purchase-order-financing",
  "/industries/construction",
  "/industries/manufacturing",
  "/industries/logistics",
  "/contact"
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `<url><loc>https://borealfinancial.com${r}</loc></url>`).join("\n")}
</urlset>`

fs.writeFileSync("public/sitemap.xml", sitemap)

console.log("Sitemap generated")
