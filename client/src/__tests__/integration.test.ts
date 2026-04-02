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
  const configuredUrl = process.argv.find((arg) => arg.startsWith("--vite-api-url="))?.split("=")[1];
  if (!configuredUrl) {
    return;
  }

  const status = await requestStatus(`${configuredUrl.replace(/\/$/, "")}/api/v1/health`);
  assert.equal(status, 200);
});
