// BF_WEBSITE_BLOCK_v_BOREAL_INSURANCE_CROSS_LINK_v1
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Wouter's useLocation must return a tuple for tests; mock it minimally.
vi.mock("wouter", async () => {
  const actual: any = await vi.importActual("wouter");
  return {
    ...actual,
    useLocation: () => ["/", () => {}],
    Link: ({ children, href }: any) => <a href={href}>{children}</a>,
  };
});
vi.mock("@/components/cta-buttons", () => ({
  ApplyNowButton: ({ children, ...rest }: any) => <button {...rest}>{children}</button>,
  AskQuestionButton: ({ children, ...rest }: any) => <button {...rest}>{children}</button>,
}));

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

describe("BF_WEBSITE_BLOCK_v_BOREAL_INSURANCE_CROSS_LINK_v1 — Navigation", () => {
  it("desktop nav links to boreal.insure", () => {
    render(<Navigation />);
    const link = screen.getByTestId("nav-link-boreal-insurance") as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("https://boreal.insure");
    expect(link.textContent).toMatch(/Boreal Insurance/);
  });

  it("mobile menu also links to boreal.insure", () => {
    render(<Navigation />);
    // Open the mobile menu first.
    fireEvent.click(screen.getByTestId("button-mobile-menu"));
    const link = screen.getByTestId(
      "mobile-nav-link-boreal-insurance",
    ) as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("https://boreal.insure");
  });
});

describe("BF_WEBSITE_BLOCK_v_BOREAL_INSURANCE_CROSS_LINK_v1 — Footer", () => {
  it("Explore column links to boreal.insure", () => {
    render(<Footer />);
    const link = screen.getByTestId("footer-link-boreal-insurance") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("https://boreal.insure");
    expect(link.textContent).toMatch(/Boreal Insurance/);
  });
});
