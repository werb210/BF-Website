// BF_WEBSITE_ONE_MAYA_WIDGET_v442
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
const app = path.resolve(process.cwd(), "client/src");

describe("v442 the website has exactly one Maya widget", () => {
  it("the unmounted duplicate is gone", () => {
    expect(existsSync(path.join(app, "components/MayaWidget.tsx"))).toBe(false);
  });

  it("the formatter that existed only for it is gone", () => {
    expect(existsSync(path.join(app, "core/rateFormatter.ts"))).toBe(false);
  });

  it("FloatingChat is the one App mounts", () => {
    const source = readFileSync(path.join(app, "App.tsx"), "utf8");
    expect(source).toContain("FloatingChat");
    expect(source).not.toContain("MayaWidget");
  });

  it("no second chat component has crept back in", () => {
    const files = readdirSync(path.join(app, "components"));
    expect(files.filter((f) => /^(Maya|FloatingChat|Chat)[A-Za-z]*\.tsx$/.test(f))).toEqual(["FloatingChat.tsx"]);
  });
});
