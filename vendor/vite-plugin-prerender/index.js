import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export default function prerender(options = {}) {
  const routes = Array.isArray(options.routes) ? options.routes : [];
  let outDir = "dist";

  return {
    name: "vite-plugin-prerender",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir || outDir;
    },
    async closeBundle() {
      if (routes.length === 0) {
        return;
      }

      const indexPath = path.resolve(outDir, "index.html");
      const indexHtml = await readFile(indexPath, "utf8");

      await Promise.all(
        routes
          .filter((route) => typeof route === "string")
          .map(async (route) => {
            const normalized = route.replace(/^\/+|\/+$/g, "");
            const targetDir = normalized.length > 0 ? path.resolve(outDir, normalized) : path.resolve(outDir);

            await mkdir(targetDir, { recursive: true });
            await writeFile(path.join(targetDir, "index.html"), indexHtml, "utf8");
          })
      );
    },
  };
}
