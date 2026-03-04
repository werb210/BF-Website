import { brotliCompressSync, gzipSync } from "zlib";

function toBuffer(source) {
  if (Buffer.isBuffer(source)) return source;
  return Buffer.from(typeof source === "string" ? source : String(source));
}

export function visualizer(options = {}) {
  const {
    filename = "dist/bundle-analysis.html",
    gzipSize = false,
    brotliSize = false,
  } = options;

  return {
    name: "visualizer",
    apply: "build",
    generateBundle(_outputOptions, bundle) {
      const rows = Object.entries(bundle)
        .filter(([, chunk]) => "code" in chunk || "source" in chunk)
        .map(([fileName, chunk]) => {
          const source = "code" in chunk ? chunk.code : chunk.source;
          const raw = toBuffer(source);
          return {
            fileName,
            size: raw.length,
            gzip: gzipSize ? gzipSync(raw).length : null,
            brotli: brotliSize ? brotliCompressSync(raw).length : null,
          };
        })
        .sort((a, b) => b.size - a.size);

      const html = `<!doctype html>
<html>
<head><meta charset="utf-8"/><title>Bundle Analysis</title>
<style>body{font-family:Arial,sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:right}th:first-child,td:first-child{text-align:left}</style>
</head>
<body>
<h1>Bundle Analysis</h1>
<table>
<thead><tr><th>Asset</th><th>Size (bytes)</th>${gzipSize ? "<th>Gzip (bytes)</th>" : ""}${brotliSize ? "<th>Brotli (bytes)</th>" : ""}</tr></thead>
<tbody>
${rows
  .map((row) => `<tr><td>${row.fileName}</td><td>${row.size}</td>${gzipSize ? `<td>${row.gzip}</td>` : ""}${brotliSize ? `<td>${row.brotli}</td>` : ""}</tr>`)
  .join("\n")}
</tbody>
</table>
</body>
</html>`;

      this.emitFile({
        type: "asset",
        fileName: filename.replace(/^dist\//, ""),
        source: html,
      });
    },
  };
}

export default visualizer;
