// BF_WEBSITE_PHONE_LEADING_ONE_v1
import { describe, expect, it } from "vitest";
import { formatPhone, toE164 } from "../formatters";

describe("formatPhone with a leading 1", () => {
  it("keeps all 10 digits when the number is typed with the country code", () => {
    expect(formatPhone("15406930536")).toBe("(540) 693-0536");
    expect(toE164(formatPhone("15406930536"))).toBe("+15406930536");
    expect(formatPhone("+1 540 693 0536")).toBe("(540) 693-0536");
  });
  it("formats correctly while typing digit by digit", () => {
    let v = "";
    for (const ch of "15406930536") v = formatPhone(v + ch);
    expect(v).toBe("(540) 693-0536");
  });
  it("leaves a plain 10-digit number unchanged", () => {
    expect(formatPhone("5406930536")).toBe("(540) 693-0536");
  });
});
