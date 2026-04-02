import { afterEach, describe, expect, it, vi } from "vitest";

describe("getEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("throws when VITE_API_URL is missing", async () => {
    vi.stubEnv("VITE_API_URL", "");

    const { getEnv: readEnv } = await import("../config/env");
    expect(() => readEnv()).toThrow();
  });

  it("returns configured VITE_API_URL", async () => {
    vi.stubEnv("VITE_API_URL", "https://example.com");

    const { getEnv: readEnv } = await import("../config/env");
    expect(readEnv().VITE_API_URL).toBe("https://example.com");
  });
});
