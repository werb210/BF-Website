// BF_WEBSITE_BLOCK_v_MAYA_AUDIENCE_HEADER_v1
import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";

// captureAttribution() reads window/document at call time; provide minimal
// stubs so the real implementation is node-safe.
(globalThis as any).window = (globalThis as any).window ?? { location: { search: "" } };
(globalThis as any).document = (globalThis as any).document ?? { referrer: "" };

import api from "@/core/apiClient";
import {
  sendMessage,
  escalateToFundingSpecialist,
  fetchFaq,
} from "@/services/mayaService";

describe("BF_WEBSITE_BLOCK_v_MAYA_AUDIENCE_HEADER_v1", () => {
  let postMock: ReturnType<typeof mock.fn>;
  let getMock: ReturnType<typeof mock.fn>;

  beforeEach(() => {
    // api is a singleton default export; mayaService calls the same instance,
    // so patching its methods here intercepts the calls (no module mocking).
    postMock = mock.fn();
    getMock = mock.fn();
    (api as any).post = postMock;
    (api as any).get = getMock;
  });

  it("sendMessage sends X-Maya-Audience: visitor", async () => {
    postMock.mock.mockImplementationOnce(() => Promise.resolve({ data: { reply: "hi" } }));
    await sendMessage("hello");
    assert.equal(postMock.mock.calls.length, 1);
    const [path, body, headers] = postMock.mock.calls[0].arguments as any[];
    assert.equal(path, "/maya/website-chat");
    assert.equal((body as any).message, "hello");
    assert.equal((headers as any)?.["X-Maya-Audience"], "visitor");
  });

  it("escalateToFundingSpecialist sends X-Maya-Audience: visitor", async () => {
    postMock.mock.mockImplementationOnce(() => Promise.resolve({ data: { ok: true } }));
    await escalateToFundingSpecialist();
    assert.equal(postMock.mock.calls.length, 1);
    const [path, , headers] = postMock.mock.calls[0].arguments as any[];
    assert.equal(path, "/maya/escalate");
    assert.equal((headers as any)?.["X-Maya-Audience"], "visitor");
  });

  it("fetchFaq sends X-Maya-Audience: visitor on GET", async () => {
    getMock.mock.mockImplementationOnce(() => Promise.resolve({ data: { faqs: [] } }));
    await fetchFaq();
    assert.equal(getMock.mock.calls.length, 1);
    const [path, headers] = getMock.mock.calls[0].arguments as any[];
    assert.equal(path, "/maya/faq");
    assert.equal((headers as any)?.["X-Maya-Audience"], "visitor");
  });
});
