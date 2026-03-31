import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET_MISSING");
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function verifyHs256Jwt(token: string, secret: string): Record<string, unknown> {
  const segments = token.split(".");
  if (segments.length !== 3) {
    throw new Error("INVALID_TOKEN");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = segments;
  const header = JSON.parse(decodeBase64Url(encodedHeader)) as { alg?: string; typ?: string };

  if (header.alg !== "HS256") {
    throw new Error("INVALID_TOKEN");
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  if (expected !== encodedSignature) {
    throw new Error("INVALID_TOKEN");
  }

  const payload = JSON.parse(decodeBase64Url(encodedPayload)) as Record<string, unknown>;
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === "number" && payload.exp < now) {
    throw new Error("INVALID_TOKEN");
  }

  return payload;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path === "/public" || req.path.startsWith("/public/")) {
    return next();
  }

  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = verifyHs256Jwt(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
}
