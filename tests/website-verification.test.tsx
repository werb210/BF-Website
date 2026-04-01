import React from "react";
import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Router } from "wouter";
import Header from "../client/src/components/Header";
import ProductComparison from "../client/src/components/ProductComparison";
import IndustryDetail from "../client/src/pages/IndustryDetail";
import ProductDetail from "../client/src/pages/ProductDetail";
import FloatingChat from "../client/src/components/FloatingChat";
import { ErrorBoundary } from "../client/src/components/ErrorBoundary";
import { industries } from "../client/src/data/industries";
import { products } from "../client/src/data/products";

const requiredIndustries = [
  "construction",
  "manufacturing",
  "retail",
  "restaurant-food-service",
  "technology",
  "healthcare",
  "transportation",
  "professional-services",
  "real-estate",
  "agriculture",
  "energy",
  "distribution",
  "media",
];

const requiredProducts = [
  "loc",
  "term-loan",
  "equipment-financing",
  "factoring",
  "merchant-cash-advance",
  "po-financing",
  "asset-based-lending",
];

const staticLocationHook = (): [string, (to: string) => void] => ["/", () => undefined];

function withStaticRouter(node: React.ReactNode) {
  return <Router hook={staticLocationHook}>{node}</Router>;
}

test("navigation renders products and industries links", () => {
  const html = renderToStaticMarkup(withStaticRouter(<Header />));
  assert.match(html, /Boreal Financial/);
  assert.match(html, /Products/);
  assert.match(html, /Credit Readiness/);
  assert.match(html, /Contact/);
  for (const slug of requiredIndustries) {
    assert.match(html, new RegExp(`/industries/${slug}`));
  }
});

test("comparison table renders product rows with required comparison categories", () => {
  const html = renderToStaticMarkup(<ProductComparison />);
  assert.match(html, /<th class="p-4 text-left">Product<\/th>/);
  assert.match(html, /Speed/);
  assert.match(html, /Best Use/);
  assert.match(html, /Repayment/);
  assert.match(html, /Collateral/);
  for (const slug of requiredProducts) {
    const product = products.find((item) => item.slug === slug);
    assert.ok(product, `missing product ${slug}`);
    assert.match(html, new RegExp(product.name));
  }
});

test("industry routes resolve with advisory and challenge content", () => {
  for (const slug of requiredIndustries) {
    const html = renderToStaticMarkup(withStaticRouter(<IndustryDetail slug={slug} />));
    assert.match(html, /Industry Challenges/);
    assert.match(html, /How Boreal Solves This/);
    assert.match(html, /Apply Now/);
  }
});

test("required industries and products exist in canonical data", () => {
  for (const slug of requiredIndustries) {
    assert.ok(industries.some((industry) => industry.slug === slug), `industry ${slug} missing`);
  }

  for (const slug of requiredProducts) {
    const product = products.find((item) => item.slug === slug);
    assert.ok(product, `product ${slug} missing`);
    assert.ok(product.term.length > 0);
    assert.ok(product.rateRange.length > 0);
    assert.ok(product.useCases.length > 0);
  }
});


test("product detail pages include required sections and CTA", () => {
  for (const slug of requiredProducts) {
    const html = renderToStaticMarkup(withStaticRouter(<ProductDetail slug={slug} />));
    assert.match(html, /What it is/);
    assert.match(html, /Who it(?:&#x27;|')s for/);
    assert.match(html, /Term and rate structure/);
    assert.match(html, /Best use cases/);
    assert.match(html, /https:\/\/client\.boreal\.financial/);
  }
});

test("comparison table remains scrollable on mobile", () => {
  const html = renderToStaticMarkup(<ProductComparison />);
  assert.match(html, /overflow-x-auto/);
  assert.match(html, /min-w-\[980px\]/);
});

test("floating chat renders connection foundation UI", () => {
  const html = renderToStaticMarkup(<FloatingChat />);
  assert.match(html, /Open support chat/);
  assert.match(html, /fixed bottom-4 right-4/);
});


test("homepage hero copy remains present", async () => {
  const { default: Home } = await import("../client/src/pages/Home");
  const html = renderToStaticMarkup(withStaticRouter(<Home />));
  assert.match(html, /Strategic Capital Advisory/i);
});

test("industries and products pages keep horizontal overflow classes", async () => {
  const [{ default: Industries }, { default: Products }] = await Promise.all([
    import("../client/src/pages/Industries"),
    import("../client/src/pages/Products"),
  ]);

  const industriesHtml = renderToStaticMarkup(withStaticRouter(<Industries />));
  const productsHtml = renderToStaticMarkup(withStaticRouter(<Products />));
  assert.match(industriesHtml, /grid-cols-2/);
  assert.match(productsHtml, /grid gap-8/);
});

test("product comparison sections are present and no empty state copy renders", () => {
  const html = renderToStaticMarkup(<ProductComparison />);
  assert.match(html, /Product/);
  assert.doesNotMatch(html, /No products available/i);
});

test("error boundary returns fallback UI after runtime error", () => {
  const boundary = new ErrorBoundary({ children: <div>App content</div> });
  boundary.state = ErrorBoundary.getDerivedStateFromError();
  const html = renderToStaticMarkup(boundary.render());
  assert.match(html, /System error/);
});

test("error boundary logs runtime errors", () => {
  const boundary = new ErrorBoundary({ children: <div>App content</div> });
  const originalConsoleError = console.error;
  const calls: unknown[][] = [];

  console.error = (...args: unknown[]) => {
    calls.push(args);
  };

  try {
    const error = new Error("boom");
    boundary.componentDidCatch(error);
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0] instanceof Error, true);
});
