// BF_WEBSITE_BOOKING_CALENDAR_v176
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dayKey, monthCells, slotsByDay } from "../../lib/bookingCalendar";

test("days are keyed in Alberta time, even late in the evening UTC", () => {
  assert.equal(dayKey("2026-10-06T03:30:00Z"), "2026-10-05");
  assert.equal(dayKey("2026-12-07T15:00:00Z"), "2026-12-07");
});

test("a month grid starts on the right weekday", () => {
  const oct = monthCells(2026, 10); // Oct 1 2026 is a Thursday
  assert.deepEqual(oct.slice(0, 5), [null, null, null, null, 1]);
  assert.equal(oct.filter((n) => n !== null).length, 31);
});

test("slots group under their day", () => {
  const m = slotsByDay([{ startsAt: "2026-10-05T15:00:00Z", staffIds: [] }, { startsAt: "2026-10-05T15:30:00Z", staffIds: [] }, { startsAt: "2026-10-06T15:00:00Z", staffIds: [] }]);
  assert.equal(m.get("2026-10-05")?.length, 2);
  assert.equal(m.get("2026-10-06")?.length, 1);
});

test("the page shows a calendar beside the times, stacked on phones", () => {
  const page = readFileSync("client/src/pages/Book.tsx", "utf8");
  assert.ok(page.includes('data-testid="booking-calendar" className="mt-4 grid gap-6 md:grid-cols-[320px_1fr]"'));
  assert.ok(page.includes('data-testid="booking-times"'));
  assert.ok(!page.includes("days.slice(0, 10)"));
});
