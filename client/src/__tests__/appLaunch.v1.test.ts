// BF_WEBSITE_APP_LAUNCH_v1 - /app and /app-draw-rules carry what a Canadian draw needs.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
(globalThis as unknown as { React: typeof React }).React = React;

const render = async (path: string) => {
  const mod = await import(path);
  return renderToStaticMarkup(createElement(HelmetProvider, null, createElement(mod.default)));
};

describe("app launch pages", () => {
  it("/app links to Google Play, shows App Store as coming soon until its link is set, and links the rules", async () => {
    const html = await render("../pages/GetTheApp");
    assert.match(html, /play\.google\.com\/store\/apps\/details\?id=com\.boreal\.client/);
    assert.match(html, /App Store: coming soon/);
    assert.match(html, /No purchase necessary/);
    assert.match(html, /href="\/app-draw-rules"/);
  });
  it("the rules cover no purchase, the email entry, Quebec, the skill-testing question, prize value and odds", async () => {
    const html = await render("../pages/AppDrawRules");
    for (const re of [/No purchase necessary/, /App draw/, /excluding Quebec/, /skill-testing question/, /\$600/, /odds of winning/]) assert.match(html, re);
  });
});
