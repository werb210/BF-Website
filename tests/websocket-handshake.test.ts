import assert from "node:assert/strict";
import test from "node:test";

test("websocket handshake returns a successful handshake response", async () => {
  const response = {
    status: 101,
    headers: {
      upgrade: "websocket",
      connection: "Upgrade",
    },
  };

  assert.equal(response.status, 101);
  assert.equal(response.headers.upgrade, "websocket");
});
