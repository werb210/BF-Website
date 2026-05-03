import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FloatingChat from "../FloatingChat";

// Force the Maya health check to report offline.
vi.mock("@/lib/mayaClient", () => ({
  buildMayaWebSocketUrl: () => null,
  checkMayaHealth: vi.fn().mockResolvedValue(false),
  isMayaConfigured: () => false,
}));

beforeEach(() => {
  vi.spyOn(global, "fetch").mockImplementation(async () =>
    new Response(JSON.stringify({ ok: true }), { status: 200 })
  );
});

describe("BF_WEBSITE_BLOCK_v9 — Maya widget never freezes when offline", () => {
  it("input is typeable even when offline", async () => {
    render(<FloatingChat />);
    fireEvent.click(screen.getByLabelText(/Open support chat/i));
    const input = (await screen.findByPlaceholderText(/Maya is offline|Type your message/)) as HTMLInputElement;
    expect(input).not.toBeDisabled();
    fireEvent.change(input, { target: { value: "Hi I need help" } });
    expect(input.value).toBe("Hi I need help");
  });

  it("Send button posts to /api/website/contact when WebSocket is unavailable", async () => {
    render(<FloatingChat />);
    fireEvent.click(screen.getByLabelText(/Open support chat/i));
    const input = (await screen.findByPlaceholderText(/Maya is offline|Type your message/)) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Test offline" } });
    fireEvent.click(screen.getByLabelText(/Send chat message/i));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/website/contact",
        expect.objectContaining({ method: "POST" })
      );
    });
    await screen.findByText(/queued.*specialist|Couldn't reach/i);
  });
});
