import assert from "node:assert/strict";
import test from "node:test";
import { spawn } from "node:child_process";
import { WebSocket } from "ws";

async function waitForServerReady(port: number) {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      if (response.ok) return;
    } catch {
      // keep polling until timeout
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Timed out waiting for server start");
}

async function stopProcess(proc: ReturnType<typeof spawn>) {
  if (proc.killed) return;
  try {
    process.kill(-proc.pid!, "SIGTERM");
  } catch {
    return;
  }
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      try {
        process.kill(-proc.pid!, "SIGKILL");
      } catch {
        // already exited
      }
      resolve();
    }, 2000);
    proc.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

test("websocket chat endpoint accepts handshake and echoes session-aware response", async () => {
  const port = 4199;
  const server = spawn("npx", ["tsx", "server/index.ts"], {
    env: { ...process.env, PORT: String(port), NODE_ENV: "test" },
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });

  let ws: WebSocket | null = null;

  try {
    await waitForServerReady(port);

    ws = await new Promise<WebSocket>((resolve, reject) => {
      const socket = new WebSocket(`ws://127.0.0.1:${port}/ws/chat`, { origin: "http://localhost:5173" });
      socket.once("open", () => resolve(socket));
      socket.once("error", reject);
    });

    const responses: string[] = [];

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timed out waiting for websocket responses")), 8000);

      ws!.on("message", (raw) => {
        const payload = JSON.parse(raw.toString()) as { message?: string };
        if (payload.message) {
          responses.push(payload.message);
        }
        if (responses.length >= 2) {
          clearTimeout(timer);
          resolve();
        }
      });

      ws!.on("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });

      ws!.send(JSON.stringify({ type: "join", sessionId: "session-123" }));
      ws!.send(JSON.stringify({ type: "message", sessionId: "session-123", message: "Hello" }));
    });

    assert.match(responses[0], /Connected to Boreal support/);
    assert.match(responses[1], /session-123/);
  } finally {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    await stopProcess(server);
  }
});
