import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import compression from "compression";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";

import { registerRoutes } from "./routes";
import contactRoute from "./routes/contact";
import leadRoute from "./routes/lead";
import mayaRoutes from "./routes/maya";
import publicRoutes from "./routes/public";
import { registerMarketingRoutes } from "./routes/marketing";
import { createRateLimiter } from "./security";
import { logger } from "./logger";
import { startChatServer } from "./ws";

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

// Keep public intake routes mounted before all other API route groups.
app.use("/api/public", publicRoutes);
app.use("/api/contact", contactRoute);
app.use("/api/lead", leadRoute);
app.use("/api/maya", mayaRoutes);
registerMarketingRoutes(app);

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
  startChatServer(server);
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
