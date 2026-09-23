// BF_WEBSITE_MAYA_MARKDOWN_v440 (runner corrected in v444)
// node:test, no DOM. toBlocks is pure so it is tested directly; the rendering
// path is asserted against source, the way the rest of this suite does it.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { toBlocks } from "../mayaMarkdown";

const app = path.resolve(process.cwd(), "client/src");
const markdown = fs.readFileSync(path.join(app, "components/mayaMarkdown.tsx"), "utf8");
const chat = fs.readFileSync(path.join(app, "components/FloatingChat.tsx"), "utf8");

describe("v440 the public Maya widget renders replies", () => {
  it("FloatingChat routes assistant replies through the renderer", () => {
    assert.ok(chat.includes("MayaMessage"));
    assert.ok(chat.includes('item.from === "user" ? item.message'));
  });

  it("only http(s) links are ever built", () => {
    assert.ok(markdown.includes("https?:\\/\\/"));
    assert.ok(markdown.includes('rel="noopener noreferrer"'));
  });

  it("no HTML string is ever constructed", () => {
    assert.ok(!markdown.includes("dangerouslySetInnerHTML"));
  });

  it("breaks an inline numbered run into a real list", () => {
    const blocks = toBlocks("We offer: 1. Lines of Credit 2. Term Loans 3. Equipment Financing");
    const ol = blocks.find((b) => b.kind === "ol");
    assert.equal(ol && "items" in ol ? ol.items.length : 0, 3);
  });

  it("handles dashed bullets the same way", () => {
    const blocks = toBlocks("Features: - **Fast funding**: days - **No collateral**: usually");
    const ul = blocks.find((b) => b.kind === "ul");
    assert.equal(ul && "items" in ul ? ul.items.length : 0, 2);
  });

  it("leaves an ordinary reply as one paragraph", () => {
    assert.equal(toBlocks("We work with over 100 lenders across Canada and the US.").length, 1);
  });

  it("survives an empty message", () => {
    assert.deepEqual(toBlocks(""), []);
  });

  it("lives in the tree vite actually builds", () => {
    const vite = fs.readFileSync(path.resolve(process.cwd(), "vite.config.ts"), "utf8");
    assert.ok(vite.includes('root: path.resolve(__dirname, "client")'));
  });
});
