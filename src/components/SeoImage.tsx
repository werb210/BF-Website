import type { ImgHTMLAttributes } from "react";

interface SeoImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "src" | "loading"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
}

export function SeoImage({ src, alt, width, height, loading = "lazy", style, ...rest }: SeoImageProps) {
  if (!alt || alt.trim().length === 0) {
    throw new Error(`SeoImage requires a non-empty alt attribute for source: ${src}`);
  }

  return <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #0a0f1c, #1c2a4a)", borderRadius: "8px" }} />;
}
