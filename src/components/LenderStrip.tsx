import type { CSSProperties } from "react";

export default function LenderStrip() {
  const logos = [
    "/images/lenders/lender1.png",
    "/images/lenders/lender2.png",
    "/images/lenders/lender3.png",
    "/images/lenders/lender4.png",
  ];

  return (
    <section style={container} aria-label="Lender partners">
      {logos.map((src, i) => (
        <img key={i} src={src} alt="Lender partner" width={300} height={120} loading="lazy" style={{ ...imgStyle, objectFit: "cover" }} decoding="async" />
      ))}
    </section>
  );
}

const container: CSSProperties = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "40px 0",
  flexWrap: "wrap",
};

const imgStyle: CSSProperties = {
  height: 50,
  margin: 15,
  opacity: 0.8,
  width: "auto",
};
