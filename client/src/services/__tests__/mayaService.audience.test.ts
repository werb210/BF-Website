// BF_WEBSITE_BLOCK_v_MAYA_AUDIENCE_HEADER_v1
import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import api from "@/core/apiClient";
import {
  sendMessage,
  escalateToFundingSpecialist,
  fetchFaq,
} from "@/services/mayaService";

// captureAttribution() reads window/document at call time; provide minimal
// stubs so the real implementation is node-safe. (Imports above are hoisted;
// these run before any test calls into mayaService.)
const globals = globalThis as unknown as {
  window?: { location: { search: string } };
  document?: { referrer: string };
};
globals.window = globals.window ?? { location: { search: "" } };
globals.document = globals.document ?? { referrer: "" };

// api is a singleton default export; mayaService calls the same instance, so
// patching its methods here intercepts the calls (no module mocking needed).
const patchable = api as unknown as {
  post: (...args: unknown[]) => unknown;
  get: (...args: unknown[]) => unknown;
};

describe("BF_WEBSITE_BLOCK_v_MAYA_AUDIENCE_HEADER_v1", () => {
  let postMock: ReturnType<typeof mock.fn>;
  let getMock: ReturnType<typeof mock.fn>;

  beforeEach(() => {
    postMock = mock.fn();
    getMock = mock.fn();
    patchable.post = postMock;
    patchable.get = getMock;
  });

  it("sendMessage sends X-Maya-Audience: visitor", async () => {
    postMock.mock.mockImplementationOnce(() => Promise.resolve({ data: { reply: "hi" } }));
    await sendMessage("hello");
    assert.equal(postMock.mock.calls.length, 1);
    const [path, body, headers] = postMock.mock.calls[0].arguments as [
      string,
      { message: string },
      Record<string, string>,
    ];
    assert.equal(path, "/maya/website-chat");
    assert.equal(body.message, "hello");
    assert.equal(headers?.["X-Maya-Audience"], "visitor");
  });

  it("escalateToFundingSpecialist sends X-Maya-Audience: visitor", async () => {
    postMock.mock.mockImplementationOnce(() => Promise.resolve({ data: { ok: true } }));
    await escalateToFundingSpecialist();
    assert.equal(postMock.mock.calls.length, 1);
    const [path, , headers] = postMock.mock.calls[0].arguments as [
      string,
      unknown,
      Record<string, string>,
    ];
    assert.equal(path, "/maya/escalate");
    assert.equal(headers?.["X-Maya-Audience"], "visitor");
  });

  it("fetchFaq sends X-Maya-Audience: visitor on GET", async () => {
    getMock.mock.mockImplementationOnce(() => Promise.resolve({ data: { faqs: [] } }));
    await fetchFaq();
    assert.equal(getMock.mock.calls.length, 1);
    const [path, headers] = getMock.mock.calls[0].arguments as [
      string,
      Record<string, string>,
    ];
    assert.equal(path, "/maya/faq");
    assert.equal(headers?.["X-Maya-Audience"], "visitor");
  });
});
