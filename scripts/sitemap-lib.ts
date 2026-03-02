import { Transform } from "node:stream";

interface SitemapItem {
  url: string;
}

interface SitemapStreamOptions {
  hostname: string;
}

export class SitemapStream extends Transform {
  private readonly hostname: string;
  private readonly urls: SitemapItem[] = [];

  constructor({ hostname }: SitemapStreamOptions) {
    super({ objectMode: true });
    this.hostname = hostname.replace(/\/$/, "");
  }

  _transform(chunk: SitemapItem, _encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    this.urls.push(chunk);
    callback();
  }

  _flush(callback: (error?: Error | null) => void) {
    const entries = this.urls
      .map((entry) => `  <url>\n    <loc>${escapeXml(`${this.hostname}${entry.url}`)}</loc>\n  </url>`)
      .join("\n");

    this.push(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`);
    callback();
  }
}

export function streamToPromise(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk))));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
