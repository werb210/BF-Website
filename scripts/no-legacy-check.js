import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const banned = [
  "apiClient",
  "httpClient",
  "response.success",
  "result.success",
];

function scan(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);

    if (fs.statSync(full).isDirectory()) {
      scan(full);
    } else {
      const content = fs.readFileSync(full, "utf8");

      banned.forEach((term) => {
        if (content.includes(term)) {
          console.error(`BANNED PATTERN FOUND: ${term} in ${full}`);
          process.exit(1);
        }
      });
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
scan(path.join(__dirname, "../src"));
