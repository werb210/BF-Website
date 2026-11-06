// BF_WEBSITE_PHONE_LEADING_ONE_v1
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPhone, toE164 } from "../formatters";

test("keeps all 10 digits when the number is typed with the country code", () => {
  assert.equal(formatPhone("15406930536"), "(540) 693-0536");
  assert.equal(toE164(formatPhone("15406930536")), "+15406930536");
  assert.equal(formatPhone("+1 540 693 0536"), "(540) 693-0536");
});

test("formats correctly while typing digit by digit", () => {
  let v = "";
  for (const ch of "15406930536") v = formatPhone(v + ch);
  assert.equal(v, "(540) 693-0536");
});

test("leaves a plain 10-digit number unchanged", () => {
  assert.equal(formatPhone("5406930536"), "(540) 693-0536");
});
