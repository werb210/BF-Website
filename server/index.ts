import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import compression from "compression";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { WebSocketServer } from "ws";

import { registerRoutes } from "./routes";
import contactRoute from "./routes/contact";
import leadRoute from "./routes/lead";
import { createRateLimiter } from "./security";
import { chatMessageSchema } from "./validation";
import { logger } from "./logger";

const app = express();

app.disable("x-powered-by");

app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

app.use((_req, res, next) => {
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  next();
});

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use((req, _res, next) => {
  req.traceId = crypto.randomUUID();
  next();
});

app.use(
  createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 300,
  }),
);

app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: false, limit: "200kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/contact", contactRoute);
app.use("/api/lead", leadRoute);

process.on("unhandledRejection", (reason) => {
  logger.error({ msg: "Unhandled rejection", reason: String(reason) });
});

process.on("uncaughtException", (error) => {
  logger.error({
    msg: "Uncaught exception",
    error: error.message,
    stack: error.stack,
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      logger.info({
        msg: "API request completed",
        traceId: req.traceId,
        method: req.method,
        path: requestPath,
        statusCode: res.statusCode,
        durationMs: duration,
      });
    }
  });

  next();
});

/* ===========================
   WebSocket Setup
=========================== */

const websocketWindowMs = 60 * 1000;
const websocketMaxUpgradesPerWindow = 30;
const websocketMaxMessagesPerWindow = 60;

const websocketUpgradeStore = new Map<string, { count: number; resetAt: number }>();
const websocketMessageStore = new Map<string, { count: number; resetAt: number }>();

const allowedOrigins = (
  process.env.ALLOWED_WS_ORIGINS ??
  "https://borealfinancial.com,http://localhost:8080,http://localhost:5173"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function isAllowedOrigin(originHeader?: string) {
  if (!originHeader) return false;
  return allowedOrigins.includes(originHeader);
}

function isWebSocketRateLimited(ip: string) {
  const now = Date.now();
  const current = websocketUpgradeStore.get(ip);

  if (!current || current.resetAt <= now) {
    websocketUpgradeStore.set(ip, { count: 1, resetAt: now + websocketWindowMs });
    return false;
  }

  if (current.count >= websocketMaxUpgradesPerWindow) return true;

  current.count += 1;
  return false;
}

function isWebSocketMessageRateLimited(key: string) {
  const now = Date.now();
  const current = websocketMessageStore.get(key);

  if (!current || current.resetAt <= now) {
    websocketMessageStore.set(key, { count: 1, resetAt: now + websocketWindowMs });
    return false;
  }

  if (current.count >= websocketMaxMessagesPerWindow) return true;

  current.count += 1;
  return false;
}

/* ===========================
   Main Boot
=========================== */

(async () => {
  if (process.env.NODE_ENV === "production") {
    const required = ["PORT"];
    required.forEach((key) => {
      if (!process.env[key]) {
        throw new Error(`Missing required env var: ${key}`);
      }
    });
  }

  const server = await registerRoutes(app);
  const chatServer = new WebSocketServer({ noServer: true });

  chatServer.on("connection", (socket, req) => {
    const sourceIp = req.socket.remoteAddress || "unknown";
    let connectionSessionId = "anonymous";

    socket.send(JSON.stringify({ message: "Connected to Boreal support." }));

    socket.on("message", (incoming, isBinary) => {
      if (isBinary) {
        socket.close(1003, "Binary not supported");
        return;
      }

      const raw = incoming.toString();
      if (Buffer.byteLength(raw, "utf8") > 4096) {
        socket.close(1009, "Message too large");
        return;
      }

      let parsedPayload: unknown;
      try {
        parsedPayload = JSON.parse(raw);
      } catch {
        socket.close(1007, "Malformed JSON");
        return;
      }

      if (isWebSocketMessageRateLimited(`${sourceIp}:${connectionSessionId}`)) {
        socket.close(1008, "Too many messages");
        return;
      }

      const parsed = chatMessageSchema.safeParse(parsedPayload);
      if (!parsed.success) {
        socket.close(1007, "Invalid format");
        return;
      }

      const payload = parsed.data;

      if (payload.sessionId) {
        connectionSessionId = payload.sessionId;
      }

      if (payload.type === "staff_joined") {
        socket.send(
          JSON.stringify({
            type: "staff_joined",
            message: "Transferring you to a specialist…",
          }),
        );
        return;
      }

      if (payload.type === "message" && payload.message) {
        socket.send(
          JSON.stringify({
            message: `Received for session ${connectionSessionId}. A specialist will follow up shortly.`,
          }),
        );
      }
    });
  });

  server.on("upgrade", (req, socket, head) => {
    if (!req.url?.startsWith("/ws/chat")) {
      socket.destroy();
      return;
    }

    if (!isAllowedOrigin(req.headers.origin)) {
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }

    const sourceIp = req.socket.remoteAddress || "unknown";
    if (isWebSocketRateLimited(sourceIp)) {
      socket.write("HTTP/1.1 429 Too Many Requests\r\n\r\n");
      socket.destroy();
      return;
    }

    chatServer.handleUpgrade(req, socket, head, (client) => {
      chatServer.emit("connection", client, req);
    });
  });

  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    void _next;
    const traceId = req.traceId;
    logger.error({
      msg: "Server error",
      traceId,
      error: err instanceof Error ? err.message : "Unknown",
      stack: err instanceof Error ? err.stack : undefined,
    });
    res.status(500).json({ error: "Internal server error" });
  });

  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // Serve built client output.
    const clientBuildDir = path.resolve(process.cwd(), "dist");
    const indexHtmlPath = path.join(clientBuildDir, "index.html");

    if (!fs.existsSync(indexHtmlPath)) {
      throw new Error(`Could not find the build file: ${indexHtmlPath} (run: npm run build)`);
    }

    app.use(
      express.static(clientBuildDir, {
        index: false,
        maxAge: "1y",
        immutable: true,
        setHeaders: (res, servedPath) => {
          if (servedPath.endsWith("index.html")) {
            res.setHeader("Cache-Control", "no-store");
          }
        },
      }),
    );

    app.use("/api", (_req, res) => {
      res.status(404).json({ error: "not_found" });
    });

    // SPA fallback (must come after static)
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "not_found" });
      }

      res.setHeader("Cache-Control", "no-store");
      res.sendFile(indexHtmlPath);
    });
  } else {
    // DEV ONLY: dynamic import so production never evaluates Vite/dev-only code (prevents ESM __dirname crash)
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  }

  const port = parseInt(process.env.PORT || process.env.WEBSITES_PORT || "8080", 10);

  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      logger.info({ msg: "Server listening", port });
    },
  );
})();
