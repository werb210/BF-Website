import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { AddressInfo } from "node:net";

import { registerRoutes } from "../server/routes";
import mayaRoutes from "../server/routes/maya";
import { registerMarketingRoutes } from "../server/routes/marketing";

test("/api/maya/escalate returns accepted contract under mounted route precedence", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/maya", mayaRoutes);
  registerMarketingRoutes(app);
  const server = await registerRoutes(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as AddressInfo).port;

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/maya/escalate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    assert.equal(response.status, 202);
    const body = (await response.json()) as { ok: boolean };
    assert.equal(body.ok, true);
  } finally {
    server.close();
  }
});

test("/api/marketing/track-lead returns accepted contract under mounted route precedence", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/maya", mayaRoutes);
  registerMarketingRoutes(app);
  const server = await registerRoutes(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as AddressInfo).port;

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/marketing/track-lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "website", utm: {} }),
    });

    assert.equal(response.status, 202);
    const body = (await response.json()) as { ok: boolean };
    assert.equal(body.ok, true);
  } finally {
    server.close();
  }
});
