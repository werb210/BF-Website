// BF_WEBSITE_ONE_MAYA_WIDGET_v442
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
const root = process.cwd();

describe("v442 the website has exactly one Maya widget", () => {
  it("the unmounted duplicate is gone", () => {
    expect(existsSync(path.join(root, "src/components/MayaWidget.tsx"))).toBe(false);
  });

  it("FloatingChat is the one App mounts", () => {
    const app = readFileSync(path.join(root, "src/App.tsx"), "utf8");
    expect(app).toContain("FloatingChat");
    expect(app).not.toContain("MayaWidget");
  });

  it("no second chat component has crept back in", () => {
    const components = readdirSync(path.join(root, "src/components"));
    const chatLike = components.filter((f) => /^(Maya|FloatingChat|Chat)[A-Za-z]*\.tsx$/.test(f));
    expect(chatLike).toEqual(["FloatingChat.tsx"]);
  });
});
