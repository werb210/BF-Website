const variantCache = new Map<string, "A" | "B">();

export function getVariant(key: string): "A" | "B" {
  if (typeof window === "undefined") {
    return "A";
  }

  const cached = variantCache.get(key);
  if (cached) {
    return cached;
  }

  const variant: "A" | "B" = Math.random() > 0.5 ? "A" : "B";
  variantCache.set(key, variant);
  return variant;
}
