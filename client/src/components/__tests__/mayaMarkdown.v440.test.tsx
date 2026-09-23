// BF_WEBSITE_MAYA_MARKDOWN_v440
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MayaMessage, toBlocks } from "../mayaMarkdown";

describe("v440 the public Maya widget renders replies", () => {
  it("renders bold instead of asterisks", () => {
    render(<MayaMessage message="**Term Loans**: $10,000 to $1,000,000" />);
    expect(screen.getByText("Term Loans").tagName).toBe("STRONG");
  });

  it("renders a link instead of the bracket syntax", () => {
    render(<MayaMessage message="start [here](https://client.boreal.financial/apply/step-1)" />);
    const link = screen.getByRole("link", { name: "here" });
    expect(link).toHaveAttribute("href", "https://client.boreal.financial/apply/step-1");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("refuses a non-http scheme rather than linking it", () => {
    render(<MayaMessage message="tap [here](javascript:alert(1)) now" />);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("breaks an inline numbered run into a real list", () => {
    const blocks = toBlocks("We offer: 1. Lines of Credit 2. Term Loans 3. Equipment Financing");
    const ol = blocks.find((b) => b.kind === "ol");
    expect(ol && "items" in ol ? ol.items.length : 0).toBe(3);
  });

  it("leaves an ordinary reply as one paragraph", () => {
    expect(toBlocks("We work with over 100 lenders across Canada and the US.")).toHaveLength(1);
  });

  it("never renders raw HTML from the model", () => {
    const { container } = render(<MayaMessage message={'<img src=x onerror="alert(1)">'} />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("<img");
  });

  it("survives an empty message", () => {
    const { container } = render(<MayaMessage message="" />);
    expect(container).toBeTruthy();
  });
});
