// BF_WEBSITE_ONE_MAYA_WIDGET_v442 (runner corrected in v444)
// node:test + node:assert - this repo runs `tsx --test` and has no vitest.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const app = path.resolve(process.cwd(), "client/src");

describe("v442 the website has exactly one Maya widget", () => {
  it("the unmounted duplicate is gone", () => {
    assert.equal(fs.existsSync(path.join(app, "components/MayaWidget.tsx")), false);
  });

  it("the formatter that existed only for it is gone", () => {
    assert.equal(fs.existsSync(path.join(app, "core/rateFormatter.ts")), false);
  });

  it("FloatingChat is the one App mounts", () => {
    const source = fs.readFileSync(path.join(app, "App.tsx"), "utf8");
    assert.ok(source.includes("FloatingChat"));
    assert.ok(!source.includes("MayaWidget"));
  });

  it("no second chat component has crept back in", () => {
    const files = fs.readdirSync(path.join(app, "components"));
    const chatLike = files.filter((f) => /^(Maya|FloatingChat|Chat)[A-Za-z]*\.tsx$/.test(f));
    assert.deepEqual(chatLike, ["FloatingChat.tsx"]);
  });
});
