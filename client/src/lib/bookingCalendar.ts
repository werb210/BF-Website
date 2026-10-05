// BF_WEBSITE_BOOKING_CALENDAR_v176 - date helpers for the booking calendar (pick a day, then a time).
// Alberta is UTC-6 all year; America/Regina is UTC-6 in every browser's time-zone data.
export const BOOKING_TZ = "America/Regina";
export type BookingSlot = { startsAt: string; staffIds: string[] };

// BF_WEBSITE_LOCAL_TIME_v177 - times are shown in the visitor's own time zone (their browser's), so a
// client in Toronto or Vancouver never has to convert from Alberta time. Alberta stays the reference.
const keyFmts = new Map<string, Intl.DateTimeFormat>();
const keyFmt = (tz: string): Intl.DateTimeFormat => {
  let f = keyFmts.get(tz);
  if (!f) { f = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }); keyFmts.set(tz, f); }
  return f;
};
/** "YYYY-MM-DD" of the slot in the given time zone (Alberta by default). */
export const dayKey = (iso: string, tz: string = BOOKING_TZ): string => keyFmt(tz).format(new Date(iso));

export function slotsByDay<T extends { startsAt: string }>(slots: T[], tz: string = BOOKING_TZ): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const s of slots) { const k = dayKey(s.startsAt, tz); const list = m.get(k); if (list) list.push(s); else m.set(k, [s]); }
  return m;
}

// Alberta is UTC-6 all year from 2026. A browser that reports the old Alberta zone name may still
// carry the retired winter offset, so those visitors are shown Alberta time from the fixed zone.
const ALBERTA_ZONE_NAMES = ["America/Edmonton", "Canada/Mountain"];
/** The visitor's IANA time zone, or Alberta when it cannot be read. */
export function visitorTimeZone(read: () => string | undefined = () => Intl.DateTimeFormat().resolvedOptions().timeZone): string {
  try {
    const tz = read();
    if (!tz) return BOOKING_TZ;
    new Intl.DateTimeFormat("en-CA", { timeZone: tz }); // throws on a zone this browser cannot format
    return ALBERTA_ZONE_NAMES.includes(tz) ? BOOKING_TZ : tz;
  } catch { return BOOKING_TZ; }
}
/** "Alberta time", or the zone's long name, e.g. "Eastern Daylight Time". */
export function zoneLabel(tz: string, at: Date = new Date()): string {
  if (tz === BOOKING_TZ) return "Alberta time";
  try {
    const part = new Intl.DateTimeFormat("en-CA", { timeZone: tz, timeZoneName: "long" }).formatToParts(at).find((x) => x.type === "timeZoneName");
    return part?.value || tz;
  } catch { return tz; }
}
/** "9:00 a.m." for the slot in the given time zone. */
export const timeIn = (iso: string, tz: string): string => new Intl.DateTimeFormat("en-CA", { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(new Date(iso));

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
