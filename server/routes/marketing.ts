import type { Express } from "express";

export function registerMarketingRoutes(app: Express) {
  app.post("/api/marketing/track-lead", (_req, res) => {
    res.status(202).json({ ok: true });
  });
}
