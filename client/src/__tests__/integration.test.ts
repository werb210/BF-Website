import assert from "node:assert/strict";
import test from "node:test";

test("backend must be reachable when configured", async () => {
  if (!process.env.VITE_API_URL) {
    return;
  }

  const res = await fetch(`${process.env.VITE_API_URL}/health`);
  assert.equal(res.status, 200);
});
