// BF_WEBSITE_BOOK_TEAM_v1
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";

const root = path.resolve(__dirname, "../..");
const r = (p: string) => fs.readFileSync(path.resolve(root, p), "utf8");

describe("the Personal Guarantee Insurance team booking page", () => {
  const page = r("pages/Book.tsx");
  const router = r("router/AppRouter.tsx");
  it("lives at /book-pgi, ahead of the per-advisor /book-<name> route", () => {
    const at = router.indexOf('<Route path="/book-pgi">{() => <Book team="pgi" />}</Route>');
    assert.ok(at > 0);
    assert.ok(at < router.indexOf('<Route path="/:page">'));
  });
  it("asks the server for the team's times for the chosen kind, and books with the team and the rep", () => {
    assert.ok(page.includes('"/booking/slots?team=" + encodeURIComponent(team) + "&kind=" + kind'));
    assert.ok(page.includes("...(team ? { team, ...(rep ? { rep } : {}) } : { staffId })"));
  });
  it("offers a 15-minute phone call and a 30-minute Teams meeting, and names nobody", () => {
    assert.ok(page.includes('phone: "15-minute phone call", teams: "30-minute Teams meeting"'));
    const block = page.slice(page.indexOf("const TEAM_PAGES"), page.indexOf("export function repFromSearch"));
    assert.ok(!/Todd|Andrew/.test(block));
  });
  it("is kept out of search results", () => {
    assert.ok(page.includes("noindex={Boolean(teamPage)}"));
  });
});
