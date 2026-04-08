import { afterEach, describe, expect, it, vi } from "vitest";

describe("env", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("throws when VITE_API_URL is missing", async () => {
    vi.stubEnv("VITE_API_URL", "");

    await expect(import("../config/env")).rejects.toThrow("Missing VITE_API_URL");
  });

  it("returns configured VITE_API_URL", async () => {
    vi.stubEnv("VITE_API_URL", "https://example.com");

    const { env } = await import("../config/env");
    expect(env.API_URL).toBe("https://example.com");
  });
});
