// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FloatingChat from "@/components/FloatingChat";

const sendMessageMock = vi.fn();
const escalateMock = vi.fn();
const reportIssueMock = vi.fn();
const checkHealthMock = vi.fn();

vi.mock("@/utils/session", () => ({
  getReadinessSessionToken: () => "session-test-123",
}));

vi.mock("@/services/mayaService", () => ({
  sendMessage: (...args: unknown[]) => sendMessageMock(...args),
  escalateToFundingSpecialist: (...args: unknown[]) => escalateMock(...args),
  reportIssue: (...args: unknown[]) => reportIssueMock(...args),
}));

vi.mock("@/lib/mayaClient", () => ({
  isMayaConfigured: () => true,
  checkMayaHealth: (...args: unknown[]) => checkHealthMock(...args),
}));

describe("FloatingChat", () => {
  beforeEach(() => {
    sendMessageMock.mockReset();
    escalateMock.mockReset();
    reportIssueMock.mockReset();
    checkHealthMock.mockReset();
    checkHealthMock.mockResolvedValue(true);
  });

  it("opens from floating button and shows greeting", async () => {
    render(<FloatingChat />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
    expect(await screen.findByText(/Before we get going/i)).toBeInTheDocument();
  });

  it("submits a message via sendMessage and renders reply", async () => {
    sendMessageMock.mockResolvedValueOnce({ reply: "Agent reply" });
    render(<FloatingChat />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

    fireEvent.change(screen.getByPlaceholderText("Type a message…"), {
      target: { value: "Hi Maya" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(sendMessageMock).toHaveBeenCalledWith("Hi Maya", { sessionId: "session-test-123" });
    });
    expect(await screen.findByText("Agent reply")).toBeInTheDocument();
  });

  it("escalates to human support", async () => {
    escalateMock.mockResolvedValueOnce({ ok: true });
    render(<FloatingChat />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
    fireEvent.click(screen.getByRole("button", { name: "Talk to a Human" }));

    await waitFor(() => expect(escalateMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByText(/Boreal advisor has been notified/i)).toBeInTheDocument();
  });

  it("reports an issue", async () => {
    reportIssueMock.mockResolvedValueOnce({ ok: true });
    render(<FloatingChat />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
    fireEvent.click(screen.getByRole("button", { name: "Report an Issue" }));

    fireEvent.change(screen.getByPlaceholderText("Describe the issue…"), {
      target: { value: "Broken thing" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(reportIssueMock).toHaveBeenCalledWith({
        sessionId: "session-test-123",
        message: "Broken thing",
      });
    });
  });

  it("shows offline banner and offline placeholder when health check fails", async () => {
    checkHealthMock.mockResolvedValueOnce(false);
    render(<FloatingChat />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

    expect(await screen.findByText("Chat offline. Please contact us directly.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Maya is offline — your message will be saved")).toBeInTheDocument();
  });
});
