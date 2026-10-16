// BF_WEBSITE_v814_FIELD_LABELS - form fields are named by the label the visitor sees, never by what they typed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { fieldName } from "../client/src/utils/siteBehaviour";

type Attrs = Record<string, string>;
function labelEl(text: string, inner: string[] = []) {
  return {
    cloneNode: () => {
      const kept = { text, removed: false };
      return {
        querySelectorAll: () => ({ forEach: (fn: (n: { remove: () => void }) => void) => inner.forEach(() => fn({ remove: () => { kept.removed = true; } })) }),
        get textContent() { return kept.text; },
      };
    },
  };
}
function field(attrs: Attrs, labels: unknown[] = []) {
  return {
    id: attrs.id ?? "",
    labels,
    getAttribute: (k: string) => (k in attrs ? attrs[k] : null),
    ownerDocument: { getElementById: () => null },
  } as unknown as Element;
}

test("uses the visible label and drops a trailing asterisk", () => {
  assert.equal(fieldName(field({ name: "phone" }, [labelEl("Phone number *")])), "Phone number");
});
test("falls back to aria-label, placeholder, then name", () => {
  assert.equal(fieldName(field({ "aria-label": "Your email", name: "email" })), "Your email");
  assert.equal(fieldName(field({ placeholder: "Company name", name: "company" })), "Company name");
  assert.equal(fieldName(field({ name: "message" })), "message");
});
test("skips auto-generated ids", () => {
  assert.equal(fieldName(field({ id: ":r5:" })), "field");
});
