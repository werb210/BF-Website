import fs from "fs"

const path = "dist/index.html"

if (!fs.existsSync(path)) {
  console.error("Missing dist/index.html")
  process.exit(1)
}

const content = fs.readFileSync(path, "utf-8")

if (content.length < 200) {
  console.error("dist/index.html too small — likely broken build")
  process.exit(1)
}

if (!content.includes("<html")) {
  console.error("dist/index.html invalid HTML")
  process.exit(1)
}

console.log("dist verification passed")
