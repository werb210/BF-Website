// BF_WEBSITE_BLOCK_v_MAYA_AUDIENCE_HEADER_v1
import { describe, it, expect, vi, beforeEach } from "vitest";

const postMock = vi.fn();
const getMock = vi.fn();
vi.mock("@/core/apiClient", () => ({
  default: {
    post: (...args: unknown[]) => postMock(...args),
    get: (...args: unknown[]) => getMock(...args),
  },
}));
vi.mock("@/core/attribution", () => ({
  captureAttribution: () => ({ utm_source: "test" }),
}));

import {
  sendMessage,
  escalateToFundingSpecialist,
  fetchFaq,
} from "@/services/mayaService";

describe("BF_WEBSITE_BLOCK_v_MAYA_AUDIENCE_HEADER_v1", () => {
  beforeEach(() => {
    postMock.mockReset();
    getMock.mockReset();
  });

  it("sendMessage sends X-Maya-Audience: visitor", async () => {
    postMock.mockResolvedValueOnce({ data: { reply: "hi" } });
    await sendMessage("hello");
    expect(postMock).toHaveBeenCalledTimes(1);
    const [path, body, headers] = postMock.mock.calls[0];
    expect(path).toBe("/maya/website-chat");
    expect(body).toMatchObject({ message: "hello" });
    expect(headers?.["X-Maya-Audience"]).toBe("visitor");
  });

  it("escalateToFundingSpecialist sends X-Maya-Audience: visitor", async () => {
    postMock.mockResolvedValueOnce({ data: { ok: true } });
    await escalateToFundingSpecialist();
    expect(postMock).toHaveBeenCalledTimes(1);
    const [path, , headers] = postMock.mock.calls[0];
    expect(path).toBe("/maya/escalate");
    expect(headers?.["X-Maya-Audience"]).toBe("visitor");
  });

  it("fetchFaq sends X-Maya-Audience: visitor on GET", async () => {
    getMock.mockResolvedValueOnce({ data: { faqs: [] } });
    await fetchFaq();
    expect(getMock).toHaveBeenCalledTimes(1);
    const [path, headers] = getMock.mock.calls[0];
    expect(path).toBe("/maya/faq");
    expect(headers?.["X-Maya-Audience"]).toBe("visitor");
  });
});
