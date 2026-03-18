import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { AddressInfo } from "node:net";
import { registerRoutes } from "../server/routes";

test("support tracking endpoint accepts events", async () => {
  const app = express();
  app.use(express.json());
  const server = await registerRoutes(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as AddressInfo).port;

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/support/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "chat_opened", source: "website" }),
    });

    assert.equal(response.status, 202);
    const body = (await response.json()) as { ok: boolean };
    assert.equal(body.ok, true);
  } finally {
    server.close();
  }
});
