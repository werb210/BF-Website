import assert from "node:assert/strict";
import test from "node:test";
import http from "node:http";
import https from "node:https";

function requestStatus(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, (res) => {
      resolve(res.statusCode ?? 0);
      res.resume();
    });

    req.on("error", reject);
  });
}

test("backend must be reachable when configured", async () => {
  if (!process.env.VITE_API_URL) {
    return;
  }

  const status = await requestStatus(`${process.env.VITE_API_URL}/health`);
  assert.equal(status, 200);
});
