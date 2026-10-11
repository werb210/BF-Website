// BF_WEBSITE_v789_FORM_LABELS
// Renders the contact form, the readiness check and the booking page and
// checks every visible input, select and textarea has an accessible label:
// a <label for=...> that matches its id, a wrapping <label>, or aria-label.
import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import Module from "node:module";
import React, { createElement, type ComponentType, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "wouter";

// The pages pull in the whole app through @/main, which imports an .svg logo
// and global.css. Vite handles those; under node they are stubbed.
const loaders = (Module as unknown as { _extensions: Record<string, (m: { exports: unknown }) => void> })._extensions;
loaders[".svg"] = (m) => { m.exports = "/logo.svg"; };
loaders[".css"] = (m) => { m.exports = {}; };
// tsx compiles the page JSX with the classic runtime outside the tsconfig include.
(globalThis as unknown as { React: typeof React }).React = React;

let ContactForm: ComponentType;
let CreditReadiness: ComponentType;
let Book: ComponentType;

before(async () => {
  ContactForm = (await import("@/components/ContactForm")).default;
  CreditReadiness = (await import("@/pages/CreditReadiness")).default;
  Book = (await import("@/pages/Book")).default as ComponentType;
});

const staticLocation = (): [string, (to: string) => void] => ["/", () => undefined];

function render(node: ReactElement): string {
  return renderToStaticMarkup(
    createElement(HelmetProvider, { context: {} }, createElement(Router, { hook: staticLocation }, node)),
  );
}

type Control = { tag: string; attrs: Record<string, string>; wrapped: boolean };

function attrsOf(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/([a-zA-Z-:]+)(?:="([^"]*)")?/g)) {
    if (m[1]) out[m[1].toLowerCase()] = m[2] ?? "";
  }
  return out;
}

function controls(html: string): Control[] {
  const found: Control[] = [];
  const re = /<(input|select|textarea)\b([^>]*)>/g;
  for (const m of html.matchAll(re)) {
    const before = html.slice(0, m.index);
    const lastOpen = before.lastIndexOf("<label");
    const lastClose = before.lastIndexOf("</label>");
    found.push({ tag: m[1] as string, attrs: attrsOf(m[2] ?? ""), wrapped: lastOpen > lastClose });
  }
  return found;
}

function isHidden(c: Control): boolean {
  return (
    c.attrs.type === "hidden" ||
    c.attrs["aria-hidden"] === "true" ||
    /(^|\s)hidden(\s|$)/.test(c.attrs.class ?? "")
  );
}

function assertAllLabelled(name: string, html: string) {
  const labelFor = new Set([...html.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)].map((m) => m[1]));
  const visible = controls(html).filter((c) => !isHidden(c));
  assert.ok(visible.length > 0, `${name}: no form controls rendered`);
  for (const c of visible) {
    const ok = c.wrapped || (c.attrs.id && labelFor.has(c.attrs.id)) || (c.attrs["aria-label"] ?? "").trim() !== "";
    assert.ok(ok, `${name}: <${c.tag} ${JSON.stringify(c.attrs)}> has no accessible label`);
  }
  return visible;
}

describe("every lead form field has an accessible label", () => {
  it("contact form: visible <label> for each field", () => {
    const html = render(createElement(ContactForm));
    const visible = assertAllLabelled("ContactForm", html);
    const labelFor = new Set([...html.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)].map((m) => m[1]));
    // visible labels, not just aria-label, on the text fields
    for (const c of visible.filter((v) => v.attrs.type !== "checkbox")) {
      assert.ok(c.attrs.id && labelFor.has(c.attrs.id), `ContactForm: ${c.attrs.name} has no visible <label>`);
    }
  });

  it("readiness check: visible <label> for each of the 13 fields", () => {
    const html = render(createElement(CreditReadiness));
    const visible = assertAllLabelled("CreditReadiness", html);
    const labelFor = new Set([...html.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)].map((m) => m[1]));
    const fields = visible.filter((v) => v.attrs.type !== "checkbox");
    assert.equal(fields.length, 13);
    for (const c of fields) {
      assert.ok(c.attrs.id && labelFor.has(c.attrs.id), `CreditReadiness: ${c.attrs.name} has no visible <label>`);
    }
  });

  it("booking page", () => {
    assertAllLabelled("Book", render(createElement(Book)));
  });

  it("each form shows the unticked CASL consent box", () => {
    for (const [name, node] of [
      ["ContactForm", createElement(ContactForm)],
      ["CreditReadiness", createElement(CreditReadiness)],
      ["Book", createElement(Book)],
    ] as const) {
      const html = render(node);
      const box = controls(html).find((c) => c.attrs.type === "checkbox" && c.attrs.name === "casl_consent");
      assert.ok(box, `${name}: no CASL checkbox`);
      assert.equal("checked" in (box as Control).attrs, false, `${name}: CASL box is pre-ticked`);
      assert.ok(
        html.includes("I agree to receive calls, texts and emails from Boreal Financial about my inquiry. I can unsubscribe at any time."),
        `${name}: consent sentence missing`,
      );
      assert.ok(
        html.includes("2630108 Alberta Ltd. o/a Boreal Financial, 450 Sparling Crt SW, Edmonton, Alberta T6X 1G9, (866) 631-8939."),
        `${name}: sender identification missing`,
      );
    }
  });
});
