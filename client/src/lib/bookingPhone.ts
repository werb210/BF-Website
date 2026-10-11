// BF_WEBSITE_v786_BOOK_PHONE - North American phone numbers only: 10 digits, or 11 starting with 1.
// Spaces, dashes, brackets, dots and a leading + are ignored; anything else makes it invalid.

/** The 10 national digits, or null when the number isn't a valid North American number. */
export function phoneDigits(input: string): string | null {
  const raw = input.trim().replace(/^\+/, "").replace(/[\s().-]/g, "");
  if (!/^[0-9]+$/.test(raw)) return null;
  if (raw.length === 10) return raw;
  if (raw.length === 11 && raw.startsWith("1")) return raw.slice(1);
  return null;
}

/** +1XXXXXXXXXX, or null when invalid. */
export function toE164(input: string): string | null {
  const d = phoneDigits(input);
  return d ? "+1" + d : null;
}

/** Formats as (403) 555-0123 while typing; a leading 1 country code is dropped. */
export function formatPhoneInput(input: string): string {
  let d = input.replace(/[^0-9]/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  if (d.length > 10) return d;
  if (d.length === 0) return "";
  if (d.length <= 3) return "(" + d;
  if (d.length <= 6) return "(" + d.slice(0, 3) + ") " + d.slice(3);
  return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
}
