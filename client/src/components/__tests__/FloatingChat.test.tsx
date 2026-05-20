import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import FloatingChat from "../FloatingChat";

vi.mock("@/services/mayaService", () => ({
  sendMessage: vi.fn(),
  escalateToFundingSpecialist: vi.fn(),
  reportIssue: vi.fn(),
}));

vi.mock("@/lib/mayaClient", () => ({
  isMayaConfigured: vi.fn(() => true),
  getMayaApiBase: vi.fn(() => "https://maya.test"),
  checkMayaHealth: vi.fn(async () => true),
}));

import * as mayaService from "@/services/mayaService";
import * as mayaClient from "@/lib/mayaClient";

const mockedSendMessage = vi.mocked(mayaService.sendMessage);
const mockedEscalate = vi.mocked(mayaService.escalateToFundingSpecialist);
const mockedReportIssue = vi.mocked(mayaService.reportIssue);
const mockedCheckHealth = vi.mocked(mayaClient.checkMayaHealth);

describe("FloatingChat (Block 115b)", () => {
  beforeEach(() => {
    mockedSendMessage.mockReset();
    mockedEscalate.mockReset();
    mockedReportIssue.mockReset();
    mockedCheckHealth.mockReset();
    mockedCheckHealth.mockResolvedValue(true);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the floating button and opens the panel on click", async () => {
    render(<FloatingChat />);
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));
    await waitFor(() => {
      expect(screen.getAllByText(/Maya/i).length).toBeGreaterThan(0);
    });
  });

  it("renders a greeting when the panel opens", async () => {
    render(<FloatingChat />);
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/what's your name and an email or phone/i),
      ).toBeInTheDocument();
    });
  });

  it("calls sendMessage when the user submits a message", async () => {
    mockedSendMessage.mockResolvedValue({ reply: "Hi back" } as unknown as Awaited<
      ReturnType<typeof mayaService.sendMessage>
    >);

    render(<FloatingChat />);
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));

    const input = await screen.findByPlaceholderText(/type a message/i);
    fireEvent.change(input, { target: { value: "hello" } });
    fireEvent.click(screen.getByRole("button", { name: /^send$/i }));

    await waitFor(() => {
      expect(mockedSendMessage).toHaveBeenCalledTimes(1);
    });
    expect(mockedSendMessage.mock.calls[0]?.[0]).toBe("hello");
    await waitFor(() => {
      expect(screen.getByText("Hi back")).toBeInTheDocument();
    });
  });

  it("calls escalateToFundingSpecialist when Talk to a Human is clicked", async () => {
    mockedEscalate.mockResolvedValue({ ok: true } as unknown as Awaited<
      ReturnType<typeof mayaService.escalateToFundingSpecialist>
    >);

    render(<FloatingChat />);
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));
    fireEvent.click(
      await screen.findByRole("button", { name: /talk to a human/i }),
    );

    await waitFor(() => {
      expect(mockedEscalate).toHaveBeenCalledTimes(1);
    });
  });

  it("switches to report mode and submits an issue", async () => {
    mockedReportIssue.mockResolvedValue({ ok: true } as unknown as Awaited<
      ReturnType<typeof mayaService.reportIssue>
    >);

    render(<FloatingChat />);
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));
    fireEvent.click(
      await screen.findByRole("button", { name: /report an issue/i }),
    );

    const textarea = await screen.findByPlaceholderText(/describe the issue/i);
    fireEvent.change(textarea, { target: { value: "page is broken" } });
    fireEvent.click(screen.getByRole("button", { name: /^submit$/i }));

    await waitFor(() => {
      expect(mockedReportIssue).toHaveBeenCalledTimes(1);
    });
    expect(mockedReportIssue.mock.calls[0]?.[0]).toMatchObject({
      message: "page is broken",
    });
  });

  it("renders the offline notice when checkMayaHealth resolves false", async () => {
    mockedCheckHealth.mockResolvedValue(false);
    render(<FloatingChat />);
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/chat offline\. please contact us directly\./i),
      ).toBeInTheDocument();
    });
  });
});
