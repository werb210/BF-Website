// BF_WEBSITE_BOOKING_PER_STAFF_v174
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";

const root = path.resolve(__dirname, "../..");
const r = (p: string) => fs.readFileSync(path.resolve(root, p), "utf8");

describe("per-advisor booking pages", () => {
  const page = r("pages/Book.tsx");
  const router = r("router/AppRouter.tsx");
  it("each advisor has their own link: /book-todd and /book/todd", () => {
    assert.ok(router.includes('/^book-[a-z0-9]+$/i.test(params.page)'));
    assert.ok(router.includes('<Route path="/book/:slug">'));
  });
  it("never lists the team: no advisor picker, one advisor looked up by link", () => {
    assert.ok(!page.includes("First available"));
    assert.ok(!page.includes('"/api/booking/staff"'));
    assert.ok(page.includes('API + "/api/booking/staff/" + encodeURIComponent(slug)'));
    assert.ok(page.includes('"Book a call with " + advisor.firstName'));
  });
  it("the book-<name> catch route sits last, so /terms, /sms and the logins still work", () => {
    const at = router.indexOf('<Route path="/:page">');
    for (const p of ['path="/terms"', 'path="/sms"', 'path="/staff-login"', 'path="/lender-login"', 'path="/system-status"']) assert.ok(router.indexOf(p) < at, p);
  });
  it("an unknown link says so instead of booking someone else", () => {
    assert.ok(page.includes("This booking link isn't active."));
  });
});
