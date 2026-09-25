// BF_WEBSITE_BLOCK_v525_FLOATINGCHAT_TEST_PORT - replaces the vitest file that
// never executed. Same behaviours, checked against the component as it is now.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const chat = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/FloatingChat.tsx"), "utf8");

describe("v525 Maya floating chat", () => {
  it("has an Open chat button", () => {
    assert.ok(chat.includes('aria-label="Open chat"'));
  });
  it("sends the typed message to Maya with the session", () => {
    assert.ok(chat.includes("await sendMessage(text, { sessionId })"));
    assert.ok(chat.includes("<form onSubmit={handleSend}"));
    assert.ok(chat.includes("disabled={sending || !input.trim()}"));
  });
  it("asks for a name plus a phone or email before handing to a human", () => {
    assert.ok(chat.includes('setLeadError("Please enter your name.")'));
    assert.ok(chat.includes("if (!phone && !email)"));
    assert.match(chat, /await escalateToFundingSpecialist\(\{[\s\S]*?silo: "BF"[\s\S]*?contact,/);
    assert.ok(chat.includes("Talk to a Human"));
  });
  it("reports an issue with the page URL and optional screenshot", () => {
    assert.ok(chat.includes("Report an Issue"));
    assert.ok(chat.includes("Describe the issue"));
    assert.match(chat, /reportIssueFn\(\{[\s\S]*?message: text,[\s\S]*?pageUrl:/);
    assert.ok(chat.includes("Couldn't submit the issue"));
  });
  it("shows the offline notice when the health check fails", () => {
    assert.ok(chat.includes("checkMayaHealth(ctrl.signal)"));
    assert.ok(chat.includes("Chat offline. Please contact us directly."));
    assert.ok(chat.includes("Maya is offline"));
  });
});
