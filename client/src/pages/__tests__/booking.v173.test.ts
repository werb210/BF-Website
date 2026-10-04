// BF_WEBSITE_BOOKING_v173
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";

const root = path.resolve(__dirname, "../..");
const r = (p: string) => fs.readFileSync(path.resolve(root, p), "utf8");

describe("booking page", () => {
  const page = r("pages/Book.tsx");
  it("is routed at /book", () => {
    assert.ok(r("router/AppRouter.tsx").includes('<Route path="/book">{() => <Book />}</Route>'));
  });
  it("offers a phone call or Microsoft Teams only - no conference calls", () => {
    assert.ok(page.includes(">Phone call</button>"));
    assert.ok(page.includes(">Microsoft Teams</button>"));
    assert.ok(!/conference/i.test(page.replace("Conference calls are\n// staff-only and are not offered here.", "")));
  });
  it("uses the server's booking API with a bot trap, and needs a phone number for phone calls", () => {
    assert.ok(page.includes('API + "/api/booking/slots?staff="'));
    assert.ok(page.includes('website: trap'));
    assert.ok(page.includes('(kind === "teams" || phone.replace(/[^0-9]/g, "").length >= 10)'));
  });
  it("shows times in Mountain time", () => {
    assert.ok(page.includes('const TZ = "America/Edmonton";'));
  });
});
