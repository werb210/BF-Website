import type { Request, Response, NextFunction, RequestHandler } from "express";
import zlib from "node:zlib";
import { logger } from "./logger";

const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "font-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
].join("; ");

export const compressionMiddleware: RequestHandler = (req, res, next) => {
  const acceptEncoding = String(req.headers["accept-encoding"] ?? "");
  if (!acceptEncoding.includes("gzip")) {
    next();
    return;
  }

  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);
  const chunks: Buffer[] = [];

  res.write = ((chunk: unknown, ...args: unknown[]) => {
    if (chunk !== undefined && chunk !== null) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    }
    return true;
  }) as Response["write"];

  res.end = ((chunk?: unknown, ...args: unknown[]) => {
    if (chunk !== undefined && chunk !== null) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    }

    if (res.statusCode < 200 || res.statusCode >= 300 || chunks.length === 0) {
      return originalEnd(chunk as never, ...(args as never));
    }

    const payload = Buffer.concat(chunks);
    const contentType = String(res.getHeader("Content-Type") ?? "");
    const isCompressible =
      contentType.includes("application/json") ||
      contentType.includes("text/") ||
      contentType.includes("javascript") ||
      contentType.includes("xml");

    if (!isCompressible || payload.length < 1024) {
      res.setHeader("Content-Length", payload.length);
      originalWrite(payload);
      return originalEnd();
    }

    const gzipped = zlib.gzipSync(payload);
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("Content-Length", gzipped.length);
    originalWrite(gzipped);
    return originalEnd();
  }) as Response["end"];

  next();
};

export const securityHeaders: RequestHandler[] = [
  (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-DNS-Prefetch-Control", "off");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Download-Options", "noopen");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    res.setHeader("Origin-Agent-Cluster", "?1");
    res.setHeader("X-XSS-Protection", "0");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Content-Security-Policy", csp);
    next();
  },
];

export function createRateLimiter({ windowMs, max }: { windowMs: number; max: number }) {
  const store = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const current = store.get(key);

    if (!current || current.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      logger.warn({ msg: "Rate limit exceeded", ip: req.ip, path: req.path, traceId: req.traceId });
      res.status(429).json({ error: "Too many requests" });
      return;
    }

    current.count += 1;
    next();
  };
}
