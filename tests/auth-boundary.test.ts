import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import type { AddressInfo } from "node:net";

test("/api/leads requires bearer token", async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
  const { authMiddleware } = await import("../server/middleware/auth");

  const app = express();
  app.use(express.json());
  app.use("/api", authMiddleware);
  app.get("/api/leads", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/leads`);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: "UNAUTHORIZED" });
  } finally {
    server.close();
  }
});
