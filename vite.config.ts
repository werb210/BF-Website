import { defineConfig, type Plugin } from "vite";
import type { OutputBundle } from "rollup";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { brotliCompressSync } from "zlib";
import viteCompression from "vite-plugin-compression";
import { imagetools } from "vite-imagetools";
import sitemap from "vite-plugin-sitemap";
import prerender from "vite-plugin-prerender";


const brotliBundlePlugin: Plugin = {
  name: "emit-brotli-assets",
  generateBundle(_options, bundle: OutputBundle) {
    for (const fileName of Object.keys(bundle)) {
      const chunk = bundle[fileName];
      if (!chunk || !("code" in chunk || "source" in chunk)) {
        continue;
      }

      const source = "code" in chunk ? chunk.code : chunk.source;
      if (!source || fileName.endsWith(".br") || fileName.endsWith(".gz")) {
        continue;
      }

      const buffer = Buffer.isBuffer(source) ? source : Buffer.from(source.toString());
      if (buffer.length < 10240) {
        continue;
      }

      this.emitFile({
        type: "asset",
        fileName: `${fileName}.br`,
        source: brotliCompressSync(buffer),
      });
    }
  },
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "client/public"),
  plugins: [
    react(),
    imagetools(),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
    }),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240,
    }),
    sitemap({
      hostname: "https://borealfinance.com",
    }),
    prerender({
      routes: ["/", "/apply", "/business-loans", "/equipment-financing", "/about"],
    }),
    brotliBundlePlugin,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared")
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    target: "es2020",
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    minify: "esbuild",
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
  },
  esbuild: {
    drop:
      process.env.NODE_ENV === "production"
        ? ["console", "debugger"]
        : [],
  },
});
