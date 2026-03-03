import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { AddressInfo } from "node:net";
import contactRoute from "../server/routes/contact";

test("contact form submission dedupes by email and phone", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/contact/submit", contactRoute);

  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;

  try {
    const payload = {
      company: "North Star Builders",
      firstName: "Avery",
      lastName: "Stone",
      email: "avery@example.com",
      phone: "5551234567",
    };

    const first = await fetch(`http://127.0.0.1:${port}/api/contact/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    assert.equal(first.status, 200);
    const firstJson = (await first.json()) as { success: boolean; deduped: boolean };
    assert.equal(firstJson.success, true);
    assert.equal(firstJson.deduped, false);

    const second = await fetch(`http://127.0.0.1:${port}/api/contact/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, company: "North Star Holdings" }),
    });
    assert.equal(second.status, 200);
    const secondJson = (await second.json()) as { success: boolean; deduped: boolean };
    assert.equal(secondJson.success, true);
    assert.equal(secondJson.deduped, true);
  } finally {
    server.close();
  }
});
