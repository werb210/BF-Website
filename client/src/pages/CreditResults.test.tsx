import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CreditResults from "./CreditResults";

const KEY = "boreal.credit-readiness.result";

describe("CreditResults", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders a single Apply Now CTA that points to fresh OTP apply url", () => {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({ score: 80, tier: "green", companyName: "Acme" }),
    );

    render(<CreditResults />);

    const cta = screen.getByRole("link", { name: "Apply Now" });
    expect(cta).toHaveAttribute(
      "href",
      "https://client.boreal.financial/apply?fresh=1",
    );
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.queryByRole("link", { name: "Browse products" })).toBeNull();
  });
});
