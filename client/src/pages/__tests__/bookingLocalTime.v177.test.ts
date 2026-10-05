// BF_WEBSITE_LOCAL_TIME_v177
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dayKey, slotsByDay, timeIn, visitorTimeZone, zoneLabel, BOOKING_TZ } from "../../lib/bookingCalendar";

test("a 9:00 a.m. Alberta slot reads as the visitor's own clock time", () => {
  const nineAlberta = "2026-12-07T15:00:00Z";
  assert.match(timeIn(nineAlberta, BOOKING_TZ), /^9:00/);
  assert.match(timeIn(nineAlberta, "America/Toronto"), /^10:00/);
  assert.match(timeIn(nineAlberta, "America/Vancouver"), /^7:00/);
});

test("days group in the visitor's zone", () => {
  const late = "2026-10-06T03:30:00Z"; // Oct 5, 9:30 p.m. Alberta; Oct 6, 12:30 a.m. Halifax
  assert.equal(dayKey(late), "2026-10-05");
  assert.equal(dayKey(late, "America/Halifax"), "2026-10-06");
  assert.equal(slotsByDay([{ startsAt: late }], "America/Halifax").get("2026-10-06")?.length, 1);
});

test("the visitor's zone is read from the browser, with Alberta as the fallback", () => {
  assert.equal(visitorTimeZone(() => "America/Toronto"), "America/Toronto");
  assert.equal(visitorTimeZone(() => undefined), BOOKING_TZ);
  assert.equal(visitorTimeZone(() => "Not/AZone"), BOOKING_TZ);
  assert.equal(visitorTimeZone(() => "America/Edmonton"), BOOKING_TZ);
});

test("zones are named in words", () => {
  assert.equal(zoneLabel(BOOKING_TZ), "Alberta time");
  assert.match(zoneLabel("America/Toronto", new Date("2026-12-07T15:00:00Z")), /Eastern/);
});

test("the page uses the visitor's zone, names it, and can switch to Alberta time", () => {
  const page = readFileSync("client/src/pages/Book.tsx", "utf8");
  assert.ok(page.includes("const localTz = useMemo(() => visitorTimeZone(), []);"));
  assert.ok(page.includes('data-testid="booking-zone"'));
  assert.ok(page.includes('"Show Alberta time"'));
  assert.ok(page.includes("timeIn(s.startsAt, tz)"));
  assert.ok(!page.includes("Times are Alberta time."));
});
