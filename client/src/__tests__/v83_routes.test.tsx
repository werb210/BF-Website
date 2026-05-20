import { render, screen } from "@testing-library/react";
import { AppRouter } from "../router/AppRouter";

describe("v83 routes", () => {
  it("redirects /capital-readiness-score to /credit-readiness", async () => {
    window.history.pushState({}, "", "/capital-readiness-score");
    render(<AppRouter />);
    expect(window.location.pathname).toBe("/credit-readiness");
  });

  it("renders terms page on /terms", () => {
    window.history.pushState({}, "", "/terms");
    render(<AppRouter />);
    expect(screen.getByRole("heading", { name: /Terms of Service/i })).toBeInTheDocument();
  });
});
