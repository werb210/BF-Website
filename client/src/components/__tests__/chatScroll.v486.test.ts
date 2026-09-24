// BF_WEBSITE_BLOCK_v486_MAYA_CHAT_SCROLL
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const chat = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/FloatingChat.tsx"), "utf8");

describe("v486 Maya chat scroll", () => {
  it("jumps to the bottom after layout, on new messages and typing changes", () => {
    assert.ok(chat.includes("requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; })"));
    assert.ok(chat.includes("}, [messages, sending]);"));
  });
});
