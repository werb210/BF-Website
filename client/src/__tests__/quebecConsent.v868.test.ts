// BF_WEBSITE_v868_QUEBEC_CONSENT - Google consent waits for Accept only for visitors in Quebec (Law 25).
// head-init.js is run as the browser runs it (in a sandbox with a fake window); the banner's helpers are run directly.
import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { consentNotice, fallbackRegion, knownRegion, waitForRegion } from "@/analytics/region";

const HEAD_INIT = fs.readFileSync("client/public/js/head-init.js", "utf8");

type Run = { calls: unknown[][]; win: Record<string, any>; session: Map<string, string>; fetched: string[] };

function memory(map: Map<string, string>) {
  return { getItem: (k: string) => (map.has(k) ? map.get(k)! : null), setItem: (k: string, v: string) => void map.set(k, String(v)), removeItem: (k: string) => void map.delete(k) };
}

async function runHeadInit(opts: {
  server?: unknown; fetchFails?: boolean; stored?: string; cached?: string; timeZone?: string; languages?: string[];
}): Promise<Run> {
  const session = new Map<string, string>();
  if (opts.cached) session.set("bf_privacy_region", opts.cached);
  const local = new Map<string, string>();
  if (opts.stored) local.set("boreal_consent_v1", opts.stored);
  const fetched: string[] = [];
  const events: string[] = [];
  const win: Record<string, any> = {
    localStorage: memory(local),
    sessionStorage: memory(session),
    fetch: async (url: string) => {
      fetched.push(url);
      if (opts.fetchFails) throw new Error("offline");
      return { ok: true, json: async () => ({ region: opts.server }) };
    },
    addEventListener: () => {},
    dispatchEvent: (e: { type: string }) => { events.push(e.type); return true; },
  };
  win.window = win;
  const navigator = { languages: opts.languages ?? ["en-CA"], language: (opts.languages ?? ["en-CA"])[0] };
  const Intl = { DateTimeFormat: () => ({ resolvedOptions: () => ({ timeZone: opts.timeZone ?? "America/Edmonton" }) }) };
  class CustomEvent { type: string; detail: unknown; constructor(type: string, init: { detail: unknown }) { this.type = type; this.detail = init.detail; } }
  const document = { getElementById: () => null };
  vm.runInNewContext(HEAD_INIT, { window: win, navigator, Intl, CustomEvent, document, AbortController, setTimeout, clearTimeout });
  await new Promise((r) => setTimeout(r, 20));
  // The sandbox has its own Object and Array, so its values are copied into this realm before comparing.
  const calls = JSON.parse(JSON.stringify((win.dataLayer as ArrayLike<unknown>[]).map((a) => Array.from(a)))) as unknown[][];
  return { calls, win, session, fetched: [...fetched] };
}

const updates = (r: Run) => r.calls.filter((c) => c[0] === "consent" && c[1] === "update").map((c) => c[2] as Record<string, string>);
const defaults = (r: Run) => r.calls.filter((c) => c[0] === "consent" && c[1] === "default").map((c) => c[2] as Record<string, string>);

describe("head-init.js: Google consent by region", () => {
  it("in Quebec everything stays denied until Accept", async () => {
    const r = await runHeadInit({ server: "QC" });
    assert.equal(defaults(r)[0].analytics_storage, "denied");
    assert.deepEqual(updates(r), []);
    assert.equal(r.win.__bfConsentRegion, "QC");
    assert.equal(r.session.get("bf_privacy_region"), "QC");
    assert.deepEqual(r.fetched, ["https://server.boreal.financial/api/privacy/region"]);
    assert.ok(r.calls.some((c) => c[0] === "set" && c[1] === "ads_data_redaction" && c[2] === true));
  });

  it("outside Quebec Google is granted on notice, personalised ads stay off", async () => {
    const r = await runHeadInit({ server: "other" });
    assert.deepEqual(updates(r), [{ ad_storage: "granted", analytics_storage: "granted", ad_user_data: "granted" }]);
    assert.equal(r.win.__bfConsentRegion, "other");
  });

  it("a stored Decline always wins", async () => {
    const r = await runHeadInit({ server: "other", stored: "denied" });
    assert.deepEqual(updates(r), []);
  });

  it("the session's answer is reused without asking again", async () => {
    const r = await runHeadInit({ cached: "other", server: "QC" });
    assert.deepEqual(r.fetched, []);
    assert.equal(updates(r).length, 1);
  });

  it("when the server cannot tell, Eastern time plus French (Canada) counts as Quebec", async () => {
    const qc = await runHeadInit({ fetchFails: true, timeZone: "America/Toronto", languages: ["fr-CA", "en-CA"] });
    assert.equal(qc.win.__bfConsentRegion, "QC");
    assert.deepEqual(updates(qc), []);
    assert.equal(qc.session.get("bf_privacy_region"), undefined); // a guess is not kept
    const on = await runHeadInit({ server: "unknown", timeZone: "America/Toronto", languages: ["en-CA"] });
    assert.equal(on.win.__bfConsentRegion, "other");
    assert.equal(updates(on).length, 1);
  });
});

const g = globalThis as unknown as { window?: Record<string, any> };
afterEach(() => { delete g.window; });

describe("the banner's region helpers", () => {
  it("fallbackRegion", () => {
    assert.equal(fallbackRegion("America/Montreal", ["fr-CA"]), "QC");
    assert.equal(fallbackRegion("America/Toronto", ["en-CA"]), "other");
    assert.equal(fallbackRegion("America/Edmonton", ["fr-CA"]), "other");
  });

  it("the notice says what applies", () => {
    assert.match(consentNotice("QC"), /All tracking is off until you accept\./);
    assert.match(consentNotice("other"), /on unless you decline/);
    assert.match(consentNotice("other"), /Session recordings and visitor tracking start only if you accept\./);
  });

  it("reads head-init's answer, from the page or the session", async () => {
    g.window = { __bfConsentRegion: "QC" };
    assert.equal(knownRegion(), "QC");
    g.window = { sessionStorage: memory(new Map([["bf_privacy_region", "other"]])) };
    assert.equal(knownRegion(), "other");
    assert.equal(await waitForRegion(5), "other");
  });

  it("waits for head-init's event, else falls back after the timeout", async () => {
    const listeners: Array<(e: Event) => void> = [];
    g.window = { addEventListener: (_t: string, fn: (e: Event) => void) => listeners.push(fn), removeEventListener: () => {} };
    const pending = waitForRegion(1000);
    listeners[0]({ detail: "QC" } as unknown as Event);
    assert.equal(await pending, "QC");
    g.window = { addEventListener: () => {}, removeEventListener: () => {} };
    assert.ok(["QC", "other"].includes(await waitForRegion(5)));
  });
});
