import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { createServer } from "node:http";
import { AddressInfo } from "node:net";
import WebSocket from "ws";

import { startChatServer } from "../server/ws";

test("chat websocket responses include message field", async () => {
  const app = express();
  const server = createServer(app);
  startChatServer(server);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as AddressInfo).port;

  try {
    const payload = await new Promise<string>((resolve, reject) => {
      const socket = new WebSocket(`ws://127.0.0.1:${port}/ws/chat`);

      socket.once("open", () => {
        socket.send(JSON.stringify({ type: "message", message: "hello" }));
      });

      socket.once("message", (data) => {
        const text = typeof data === "string" ? data : data.toString();
        resolve(text);
        socket.close();
      });

      socket.once("error", (error) => {
        reject(error);
      });
    });

    const parsed = JSON.parse(payload) as { message?: string };
    assert.equal(parsed.message, "Maya connected");
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
});
