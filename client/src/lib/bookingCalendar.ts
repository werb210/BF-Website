// BF_WEBSITE_BOOKING_CALENDAR_v176 - date helpers for the booking calendar (pick a day, then a time).
// Alberta is UTC-6 all year; America/Regina is UTC-6 in every browser's time-zone data.
export const BOOKING_TZ = "America/Regina";
export type BookingSlot = { startsAt: string; staffIds: string[] };

const keyFmt = new Intl.DateTimeFormat("en-CA", { timeZone: BOOKING_TZ, year: "numeric", month: "2-digit", day: "2-digit" });
/** "YYYY-MM-DD" of the slot in Alberta time. */
export const dayKey = (iso: string): string => keyFmt.format(new Date(iso));

export function slotsByDay<T extends { startsAt: string }>(slots: T[]): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const s of slots) { const k = dayKey(s.startsAt); const list = m.get(k); if (list) list.push(s); else m.set(k, [s]); }
  return m;
}

/** Cells for one month, Sunday first: null for the blanks before the 1st. month is 1-12. */
export function monthCells(year: number, month: number): Array<number | null> {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return [...Array.from({ length: first }, () => null), ...Array.from({ length: days }, (_, i) => i + 1)];
}

export const pad2 = (n: number): string => (n < 10 ? "0" : "") + n;
export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** "Monday, October 5" for a "YYYY-MM-DD" key. */
export const dayHeading = (key: string): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric" }).format(new Date(key + "T12:00:00Z"));
