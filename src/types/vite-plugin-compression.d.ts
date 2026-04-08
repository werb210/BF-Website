declare module "vite-plugin-compression" {
  import { Plugin } from "vite"

  interface CompressionOptions {
    algorithm?: "gzip" | "brotliCompress"
    ext?: string
    threshold?: number
    deleteOriginFile?: boolean
  }

  export default function compression(options?: CompressionOptions): Plugin
}
