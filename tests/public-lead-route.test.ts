import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import type { AddressInfo } from "node:net";

import publicRoutes from "../server/routes/public";

function createApp() {
  const app = express();
  app.set("trust proxy", true);
  app.use(express.json());
  app.use("/api/public", publicRoutes);
  return app;
}

test("public lead intake rejects non-JSON requests", async () => {
  const app = createApp();
  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/public/lead`, {
      method: "POST",
      headers: { "Content-Type": "text/plain", "X-Forwarded-For": "198.51.100.1" },
      body: "email=test@example.com",
    });

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "INVALID_CONTENT_TYPE" });
  } finally {
    server.close();
  }
});

test("public lead intake enforces strict schema and returns only leadId", async () => {
  const app = createApp();
  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;

  try {
    const invalid = await fetch(`http://127.0.0.1:${port}/api/public/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": "198.51.100.2" },
      body: JSON.stringify({
        email: "test@example.com",
        phone: "5555555555",
        productType: "term-loan",
        businessName: "Acme Inc",
        injected: "blocked",
      }),
    });

    assert.equal(invalid.status, 400);

    const valid = await fetch(`http://127.0.0.1:${port}/api/public/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": "198.51.100.3" },
      body: JSON.stringify({
        email: "valid@example.com",
        phone: "5555555555",
        productType: "term-loan",
        businessName: "Acme Inc",
      }),
    });

    assert.equal(valid.status, 200);
    const payload = (await valid.json()) as Record<string, string>;
    assert.deepEqual(Object.keys(payload), ["leadId"]);
    assert.ok(payload.leadId.length > 0);
  } finally {
    server.close();
  }
});

test("public lead intake rate limits after 10 requests per minute", async () => {
  const app = createApp();
  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;

  try {
    for (let index = 0; index < 10; index += 1) {
      const response = await fetch(`http://127.0.0.1:${port}/api/public/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Forwarded-For": "198.51.100.4" },
        body: JSON.stringify({
          email: `rate-${index}@example.com`,
          phone: `55555555${String(index).padStart(2, "0")}`,
          productType: "line-of-credit",
          businessName: `Rate Test ${index}`,
        }),
      });
      assert.equal(response.status, 200);
    }

    const blocked = await fetch(`http://127.0.0.1:${port}/api/public/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": "198.51.100.4" },
      body: JSON.stringify({
        email: "blocked@example.com",
        phone: "5555555999",
        productType: "line-of-credit",
        businessName: "Rate Block",
      }),
    });

    assert.equal(blocked.status, 429);
  } finally {
    server.close();
  }
});
