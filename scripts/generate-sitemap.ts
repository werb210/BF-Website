import fs from "fs"

const routes = [
  "/",
  "/contact",
  "/privacy",
  "/terms",
  "/work-with-us",
  "/industries/logistics",
  "/industries/construction",
  "/industries/manufacturing"
]

const base = "https://boreal.financial"

const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `
  <url>
    <loc>${base}${r}</loc>
  </url>
`).join("")}
</urlset>
`

// Write to Vite's deployed publicDir so generated and shipped assets cannot drift.
fs.writeFileSync("client/public/sitemap.xml", xml)
