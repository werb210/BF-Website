// BF_WEBSITE_BLOCK_1_18_UI_AND_ROUTING_FIXES — shared input formatters for
// website forms. Keep them pure / dependency-free so they can be reused.

// BF_WEBSITE_PHONE_LEADING_ONE_v1 - a leading 1 is the country code (North American area codes never start with 1).
// It used to become the area code and push the last digit off: "15406930536" was saved as +11540693053.
export function formatPhone(input: string): string {
  let all = input.replace(/\D/g, "");
  if (all.startsWith("1")) all = all.slice(1);
  const digits = all.slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function toE164(input: string, defaultCountry = "1"): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith(defaultCountry)) return `+${digits}`;
  if (digits.length === 10) return `+${defaultCountry}${digits}`;
  return "";
}

export function formatCurrency(input: string): string {
  const cleaned = input.replace(/[^0-9.]/g, "");
  if (cleaned === "") return "";
  const [whole = "", decimal] = cleaned.split(".");
  const wholeFormatted = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal !== undefined ? `${wholeFormatted}.${decimal.slice(0, 2)}` : wholeFormatted;
}

export function unformatCurrency(input: string): string {
  return input.replace(/[^0-9.]/g, "");
}

// BF_WEBSITE_v789_PHONE_RULE - one browser-side phone rule for the contact
// form and the readiness check: 10 or 11 digits, with any
// formatting characters around them.
export const PHONE_PATTERN = "[^0-9]*([0-9][^0-9]*){10,11}";
export const PHONE_TITLE = "Enter a 10-digit phone number";
