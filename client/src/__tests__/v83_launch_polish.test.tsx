import { render, screen } from "@testing-library/react";
import Header from "../components/Header";
import Footer from "../components/footer";

describe("BF_WEBSITE_BLOCK_v83_LAUNCH_POLISH_v1", () => {
  it("Header 'Visit Boreal Risk Management' link points to www.boreal.insure", () => {
    render(<Header />);
    const links = screen.getAllByRole("link", { name: /Visit Boreal Risk Management/i });
    for (const l of links) expect(l.getAttribute("href")).toBe("https://www.boreal.insure/");
  });
  it("Footer Products link goes to /products (not a sub-page)", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /^Products$/ }).getAttribute("href")).toBe("/products");
  });
  it("Footer Industries link goes to /industries (not a sub-page)", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /^Industries$/ }).getAttribute("href")).toBe("/industries");
  });
  it("Footer 'Check your Credit Readiness' uses /credit-readiness (single source)", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /Check your Credit Readiness/i }).getAttribute("href")).toBe("/credit-readiness");
  });
  it("Footer Boreal Risk Management link points to www.boreal.insure", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /Boreal Risk Management/i }).getAttribute("href")).toBe("https://www.boreal.insure/");
  });
});
