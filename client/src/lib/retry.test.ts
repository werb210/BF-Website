import { describe, expect, it, vi } from "vitest";
import { retry, withLoading } from "@/lib/retry";

describe("retry", () => {
  it("recovers from transient failures", async () => {
    vi.useFakeTimers();

    const fn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("first"))
      .mockRejectedValueOnce(new Error("second"))
      .mockResolvedValueOnce("ok");

    const pending = retry(fn, 3, 500);
    await vi.advanceTimersByTimeAsync(1000);

    await expect(pending).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });
});

describe("withLoading", () => {
  it("always resets loading state to prevent frozen UI", async () => {
    const setLoading = vi.fn<(state: boolean) => void>();

    await expect(
      withLoading(setLoading, async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");

    expect(setLoading).toHaveBeenNthCalledWith(1, true);
    expect(setLoading).toHaveBeenNthCalledWith(2, false);
  });
});
