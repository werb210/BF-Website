// BF_WEBSITE_CONTACT_REDIRECT_v151
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test, { describe } from "node:test";
import {
  ATTRIBUTION_STORAGE_KEY,
  FORWARDED_PARAMS,
  resolveContactRedirect,
} from "../shared/applyRedirect";

const APPLY = "https://client.boreal.financial/apply?continue=tok123";

describe("resolveContactRedirect", () => {
  test("returns the application URL when the server supplies one", () => {
    const url = new URL(resolveContactRedirect(APPLY));
    assert.equal(url.hostname, "client.boreal.financial");
    assert.equal(url.searchParams.get("continue"), "tok123");
  });

  test("falls back to the homepage when there is no redirect", () => {
    for (const empty of [null, undefined, ""]) {
      assert.equal(resolveContactRedirect(empty), "/");
    }
  });

  test("falls back rather than following a foreign host", () => {
    assert.equal(resolveContactRedirect("https://evil.example.com/apply"), "/");
  });

  test("falls back rather than following a non-https scheme", () => {
    assert.equal(resolveContactRedirect("http://client.boreal.financial/apply"), "/");
    assert.equal(resolveContactRedirect("javascript:alert(1)"), "/");
  });

  test("falls back on a malformed URL", () => {
    assert.equal(resolveContactRedirect("not a url"), "/");
  });

  test("appends stored ad attribution that window.location would otherwise lose", () => {
    const url = new URL(resolveContactRedirect(APPLY, {
      gclid: "abc123",
      utm_source: "google",
      referrer: "x",
    }));
    assert.equal(url.searchParams.get("gclid"), "abc123");
    assert.equal(url.searchParams.get("utm_source"), "google");
    assert.equal(url.searchParams.get("continue"), "tok123");
    assert.equal(url.searchParams.get("referrer"), null);
  });

  test("does not overwrite a parameter the server already set", () => {
    const url = new URL(resolveContactRedirect(`${APPLY}&gclid=fromserver`, {
      gclid: "fromstorage",
    }));
    assert.equal(url.searchParams.get("gclid"), "fromserver");
  });

  test("ignores blank or non-string attribution values", () => {
    const url = new URL(resolveContactRedirect(APPLY, {
      gclid: "   ",
      utm_source: 42,
    }));
    assert.equal(url.searchParams.get("gclid"), null);
    assert.equal(url.searchParams.get("utm_source"), null);
  });
});

describe("the copied constants must not drift from main.tsx", () => {
  const main = readFileSync(join(process.cwd(), "client/src/main.tsx"), "utf8");

  test("uses the same localStorage key the attribution layer writes", () => {
    assert.ok(main.includes(`ATTRIBUTION_KEY = "${ATTRIBUTION_STORAGE_KEY}"`));
  });

  test("forwards the same parameters the click interceptor forwards", () => {
    for (const key of FORWARDED_PARAMS) {
      assert.ok(main.includes(`"${key}"`), `main.tsx no longer mentions ${key}`);
    }
  });
});
