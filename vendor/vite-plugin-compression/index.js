import { gzipSync } from "node:zlib";

export default function viteCompression(options = {}) {
  const algorithm = options.algorithm ?? "gzip";

  return {
    name: "vite-plugin-compression",
    apply: "build",
    generateBundle(_, bundle) {
      if (algorithm !== "gzip") {
        return;
      }

      for (const [fileName, assetInfo] of Object.entries(bundle)) {
        if (assetInfo.type !== "asset" && assetInfo.type !== "chunk") {
          continue;
        }

        const source = assetInfo.type === "asset" ? assetInfo.source : assetInfo.code;

        if (typeof source !== "string" && !(source instanceof Uint8Array)) {
          continue;
        }

        const compressed = gzipSync(source);

        this.emitFile({
          type: "asset",
          fileName: `${fileName}.gz`,
          source: compressed,
        });
      }
    },
  };
}
