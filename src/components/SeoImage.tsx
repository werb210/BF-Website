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

  return <img src={src} alt={alt} width={width} height={height} loading={loading} style={{ objectFit: "cover", ...style }} {...rest} decoding="async" />;
}
