import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import viteCompression from "vite-plugin-compression";
import { imagetools } from "vite-imagetools";
// import prerender from "vite-plugin-prerender"; // disabled — fails in Azure Oryx
import { visualizer } from "rollup-plugin-visualizer";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "client/public"),
  // BF_WEBSITE_v859_DEP_SECURITY - Vite 6 stops looking for postcss.config.cjs at client/package.json, so point it at
  // the repo root explicitly (otherwise Tailwind never runs and the CSS ships as raw @tailwind directives).
  css: { postcss: __dirname },
  plugins: [
    react(),
    imagetools(),
    // BF_WEBSITE_v789_REAL_PACKAGES - the upstream vite-plugin-compression now
    // writes both the .br and .gz files; the hand-rolled brotli plugin that
    // stood in for the vendored stub (which only did gzip) is gone.
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
    // prerender({
    //   routes: ["/", "/apply", "/business-loans", "/equipment-financing", "/about"],
    // }),
    ...(process.env.NODE_ENV === "analyze" || process.argv.includes("analyze")
      ? [
          visualizer({
            open: false,
            gzipSize: true,
            brotliSize: true,
            filename: "dist/bundle-analysis.html",
          }),
        ]
      : []),
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
          vendor: ["framer-motion", "recharts", "zod"],
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
