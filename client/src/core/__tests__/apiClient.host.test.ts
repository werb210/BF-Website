// BF_WEBSITE_BLOCK_v_MAYA_CROSS_ORIGIN_HOST_v1 — verify apiClient prepends
// WEBSITE_API_BASE so Maya widget POSTs reach server.boreal.financial
// instead of the current page origin.
import { describe, it, expect, vi, beforeEach } from "vitest";

const apiRequestMock = vi.fn();
vi.mock("@/lib/queryClient", () => ({
  apiRequest: (...args: unknown[]) => apiRequestMock(...args),
}));
vi.mock("@/config/api", () => ({
  WEBSITE_API_BASE: "https://server.boreal.financial",
}));

beforeEach(() => {
  apiRequestMock.mockReset();
  apiRequestMock.mockResolvedValue({ json: async () => ({ ok: true }) });
});

describe("apiClient host prefix", () => {
  it("prepends WEBSITE_API_BASE to POST URLs", async () => {
    const api = (await import("../apiClient")).default;
    await api.post("/maya/website-chat", { message: "hi" });
    const [method, url] = apiRequestMock.mock.calls[0];
    expect(method).toBe("POST");
    expect(url).toBe("https://server.boreal.financial/api/maya/website-chat");
  });

  it("prepends WEBSITE_API_BASE to GET URLs", async () => {
    const api = (await import("../apiClient")).default;
    await api.get("/maya/faq");
    const [method, url] = apiRequestMock.mock.calls[0];
    expect(method).toBe("GET");
    expect(url).toBe("https://server.boreal.financial/api/maya/faq");
  });
});
