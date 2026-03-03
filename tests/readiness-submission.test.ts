import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { AddressInfo } from "node:net";
import { registerRoutes } from "../server/routes";

test("credit readiness submission returns session and dedupes by contact", async () => {
  const app = express();
  app.use(express.json());
  const server = await registerRoutes(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as AddressInfo).port;

  try {
    const payload = {
      companyName: "North Star Builders",
      fullName: "Avery Stone",
      phone: "5551234567",
      email: "avery@example.com",
      industry: "Construction",
      yearsInBusiness: "Over 3 Years",
      monthlyRevenue: "125000",
      annualRevenue: "1500000",
      arBalance: "300000",
      collateral: "Equipment" ,
    };

    const first = await fetch(`http://127.0.0.1:${port}/api/readiness/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    assert.equal(first.status, 201);
    const firstJson = (await first.json()) as { sessionId: string; deduped: boolean; score: number };
    assert.equal(firstJson.deduped, false);
    assert.ok(firstJson.sessionId);
    assert.ok(firstJson.score > 0);

    const second = await fetch(`http://127.0.0.1:${port}/api/readiness/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, companyName: "North Star Builders Ltd" }),
    });
    assert.equal(second.status, 200);
    const secondJson = (await second.json()) as { sessionId: string; deduped: boolean; score: number };
    assert.equal(secondJson.deduped, true);
    assert.equal(secondJson.sessionId, firstJson.sessionId);
    assert.equal(secondJson.score, firstJson.score);
  } finally {
    server.close();
  }
});


test("credit readiness submission rejects invalid payload", async () => {
  const app = express();
  app.use(express.json());
  const server = await registerRoutes(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as AddressInfo).port;

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/readiness/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bad: "payload" }),
    });

    assert.equal(response.status, 400);
  } finally {
    server.close();
  }
});
