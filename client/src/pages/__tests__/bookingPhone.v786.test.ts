// BF_WEBSITE_v786_BOOK_PHONE
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { formatPhoneInput, toE164 } from "../../lib/bookingPhone";

test("valid 10 and 11 digit numbers pass and are sent as E.164", () => {
  assert.equal(toE164("4035550123"), "+14035550123");
  assert.equal(toE164("(403) 555-0123"), "+14035550123");
  assert.equal(toE164("403.555.0123"), "+14035550123");
  assert.equal(toE164("14035550123"), "+14035550123");
  assert.equal(toE164("+1 403-555-0123"), "+14035550123");
  assert.equal(toE164("+1 (403) 555 0123"), "+14035550123");
});

test("9 digits, 12+ digits and 11 digits not starting with 1 are rejected", () => {
  assert.equal(toE164("403555012"), null);
  assert.equal(toE164("403555012345"), null);
  assert.equal(toE164("5555555555555555555"), null);
  assert.equal(toE164("24035550123"), null);
  assert.equal(toE164(""), null);
  assert.equal(toE164("403-555-012x"), null);
});

test("formats as (403) 555-0123 while typing", () => {
  assert.equal(formatPhoneInput("4"), "(4");
  assert.equal(formatPhoneInput("4035"), "(403) 5");
  assert.equal(formatPhoneInput("4035550123"), "(403) 555-0123");
  assert.equal(formatPhoneInput("1-403-555-0123"), "(403) 555-0123");
});

test("booking page uses the check, shows the error and sends E.164", () => {
  const page = readFileSync(new URL("../Book.tsx", import.meta.url), "utf8");
  assert.match(page, /BF_WEBSITE_v786_BOOK_PHONE/);
  assert.match(page, /Enter a 10-digit phone number/);
  assert.match(page, /phone: phoneE164/);
  assert.doesNotMatch(page, /length >= 10/);
});
