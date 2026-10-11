// BF_WEBSITE_v789_AUDIT_ROUND2 - behaviour tests for the client modules.
// Source-level checks for the rest of the round live in tests/v789.test.ts.
import { beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import api from "@/core/apiClient";
import {
  CHAT_SESSION_ENDED_MESSAGE,
  CONVERSATION_STORAGE_KEY,
  clearConversation,
  conversationHeaders,
  getConversationToken,
  isSessionEndedError,
  loadConversation,
  saveConversation,
} from "@/lib/conversationToken";
import { fetchConversationMessages, postConversationMessage, escalateToFundingSpecialist } from "@/services/mayaService";
import { CASL_CONSENT_TEXT, CASL_SENDER_LINE, caslFields } from "@/lib/casl";
import { HttpError } from "@/lib/safeFetch";
import { apiUrl, normalizeApiBase, API_BASE_URL } from "@/config/env";
import { routeMetaFor, routeMetaPaths, SITE_ORIGIN } from "@/seo/routeMeta";

type Store = Record<string, string>;
const g = globalThis as unknown as {
  window?: Record<string, unknown>;
  document?: unknown;
};

function memoryStorage(store: Store): Storage {
  return {
    getItem: (k: string) => (k in store ? store[k] as string : null),
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { for (const k of Object.keys(store)) delete store[k]; },
    key: () => null,
    get length() { return Object.keys(store).length; },
  } as Storage;
}

describe("[12] conversation token", () => {
  let store: Store;
  beforeEach(() => {
    store = {};
    g.window = { sessionStorage: memoryStorage(store), location: { search: "", href: "https://www.boreal.financial/", pathname: "/" } };
    g.document = { referrer: "" };
    clearConversation();
  });

  it("keeps the token in memory and in sessionStorage next to the conversation id", () => {
    saveConversation("c-1", "tok-1");
    assert.deepEqual(JSON.parse(store[CONVERSATION_STORAGE_KEY] as string), { conversationId: "c-1", token: "tok-1" });
    assert.equal(getConversationToken("c-1"), "tok-1");
    assert.deepEqual(conversationHeaders("c-1"), { "X-Conversation-Token": "tok-1" });
  });

  it("restores from sessionStorage after a reload (memory empty)", () => {
    store[CONVERSATION_STORAGE_KEY] = JSON.stringify({ conversationId: "c-2", token: "tok-2" });
    assert.deepEqual(loadConversation(), { conversationId: "c-2", token: "tok-2" });
  });

  it("sends no header for a conversation from an older server (no token)", () => {
    saveConversation("c-3", undefined);
    assert.deepEqual(conversationHeaders("c-3"), {});
    assert.deepEqual(conversationHeaders("other"), {});
  });

  it("keeps the token when a re-escalation into the same thread returns none", () => {
    saveConversation("c-4", "tok-4");
    saveConversation("c-4", null);
    assert.equal(getConversationToken("c-4"), "tok-4");
  });

  it("clears both copies", () => {
    saveConversation("c-5", "tok-5");
    clearConversation();
    assert.equal(store[CONVERSATION_STORAGE_KEY], undefined);
    assert.equal(loadConversation(), null);
  });

  it("survives a browser that throws on sessionStorage", () => {
    g.window = {
      get sessionStorage(): Storage { throw new Error("SecurityError"); },
    };
    clearConversation();
    saveConversation("c-6", "tok-6");
    assert.equal(getConversationToken("c-6"), "tok-6");
  });

  it("treats 401 and 403 as an ended session, nothing else", () => {
    assert.equal(isSessionEndedError(new HttpError(401, "")), true);
    assert.equal(isSessionEndedError(new HttpError(403, "")), true);
    assert.equal(isSessionEndedError(new HttpError(500, "")), false);
    assert.equal(isSessionEndedError(new Error("network")), false);
    assert.equal(isSessionEndedError(null), false);
    assert.equal(CHAT_SESSION_ENDED_MESSAGE, "Your chat session ended. Tap Talk to a human to start again.");
  });

  it("every poll and post carries X-Conversation-Token; none without a token", async () => {
    const patch = api as unknown as { get: (...a: unknown[]) => unknown; post: (...a: unknown[]) => unknown };
    const get = mock.fn(() => Promise.resolve({ data: { data: { messages: [] } } }));
    const post = mock.fn(() => Promise.resolve({ data: {} }));
    patch.get = get;
    patch.post = post;

    saveConversation("abc", "secret");
    await fetchConversationMessages("abc");
    await postConversationMessage("abc", "hi");
    const getCall = get.mock.calls[0]?.arguments as unknown[];
    const postCall = post.mock.calls[0]?.arguments as unknown[];
    assert.equal(getCall[0], "/public/conversation/abc/messages");
    assert.deepEqual(getCall[1], { "X-Conversation-Token": "secret" });
    assert.equal(postCall[0], "/public/conversation/abc/message");
    assert.deepEqual(postCall[2], { "X-Conversation-Token": "secret" });

    clearConversation();
    await fetchConversationMessages("abc");
    assert.deepEqual((get.mock.calls[1]?.arguments as unknown[])[1], {});
  });

  it("escalation sends the CASL fields and returns visitor_token", async () => {
    const patch = api as unknown as { post: (...a: unknown[]) => unknown };
    const post = mock.fn(() => Promise.resolve({ data: { ok: true, conversation_id: "c-9", visitor_token: "v-9" } }));
    patch.post = post;
    const res = await escalateToFundingSpecialist({ contact: { name: "A" }, casl: caslFields(true, new Date("2026-10-11T00:00:00Z")) });
    assert.equal(res.visitor_token, "v-9");
    const body = (post.mock.calls[0]?.arguments as unknown[])[1] as Record<string, unknown>;
    assert.equal(body.casl_consent, true);
    assert.equal(body.casl_consent_text, CASL_CONSENT_TEXT);
    assert.equal(body.casl_consent_at, "2026-10-11T00:00:00.000Z");
  });
});

describe("[126] CASL fields", () => {
  it("consent is true only when ticked; text and ISO time always sent", () => {
    const at = new Date("2026-10-11T12:00:00Z");
    assert.deepEqual(caslFields(false, at), { casl_consent: false, casl_consent_text: CASL_CONSENT_TEXT, casl_consent_at: "2026-10-11T12:00:00.000Z" });
    assert.equal(caslFields(true, at).casl_consent, true);
    assert.equal(CASL_CONSENT_TEXT, "I agree to receive calls, texts and emails from Boreal Financial about my inquiry. I can unsubscribe at any time.");
    assert.equal(CASL_SENDER_LINE, "2630108 Alberta Ltd. o/a Boreal Financial, 450 Sparling Crt SW, Edmonton, Alberta T6X 1G9, (866) 631-8939.");
  });
});

describe("[133] one API base", () => {
  it("defaults to server.boreal.financial and always lands under /api/ with no /v1/", () => {
    assert.equal(API_BASE_URL, "https://server.boreal.financial");
    assert.equal(apiUrl("/website/contact"), "https://server.boreal.financial/api/website/contact");
    assert.equal(normalizeApiBase(undefined), "https://server.boreal.financial");
    assert.equal(normalizeApiBase("  "), "https://server.boreal.financial");
    assert.equal(normalizeApiBase("https://server.boreal.financial/"), "https://server.boreal.financial");
    assert.equal(normalizeApiBase("https://server.boreal.financial/api"), "https://server.boreal.financial");
    assert.equal(normalizeApiBase("https://server.boreal.financial/api/v1/"), "https://server.boreal.financial");
  });
});

describe("[121] consent gate", () => {
  it("Clarity and behaviour tracking wait for Accept", async () => {
    const appended: Array<{ src?: string }> = [];
    const store: Store = {};
    g.window = { localStorage: memoryStorage(store) };
    g.document = { createElement: () => ({}), head: { appendChild: (el: { src?: string }) => appended.push(el) } };
    const consent = await import("@/analytics/consent");
    let started = 0;
    consent.onAnalyticsConsent(() => { started += 1; });
    assert.equal(started, 0, "tracking started before Accept");
    assert.equal(appended.length, 0, "Clarity loaded before Accept");
    consent.grantAnalyticsConsent();
    assert.equal(started, 1);
    assert.equal(appended.length, 1);
    assert.equal(appended[0]?.src, "https://www.clarity.ms/tag/vjz4kr9hqu");
    consent.grantAnalyticsConsent();
    assert.equal(appended.length, 1, "Clarity loaded twice");
    consent.onAnalyticsConsent(() => { started += 1; });
    assert.equal(started, 2, "a late subscriber after Accept runs at once");
  });
});

describe("[130] route meta", () => {
  it("covers every sitemap route with absolute canonical and og:image", async () => {
    const { ROUTES } = (await import("../../../scripts/generate-sitemap.ts")) as { ROUTES: string[] };
    assert.ok(ROUTES.length >= 30);
    for (const route of ROUTES) {
      const meta = routeMetaFor(route);
      assert.ok(meta, `no route meta for ${route}`);
      assert.ok(meta.title && meta.description, route);
      assert.equal(meta.canonical, route === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}`);
      assert.equal(meta.ogTitle, meta.title);
      assert.equal(meta.ogDescription, meta.description);
      assert.match(meta.ogImage, /^https:\/\//);
    }
    assert.ok(routeMetaPaths().length >= ROUTES.length);
    assert.equal(routeMetaFor("/contact/")?.path, "/contact");
    assert.equal(routeMetaFor("/contact?gclid=1")?.path, "/contact");
    assert.equal(routeMetaFor("/no-such-page"), undefined);
  });
});
