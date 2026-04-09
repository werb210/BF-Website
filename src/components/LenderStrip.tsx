import type { CSSProperties } from "react";

export default function LenderStrip() {
  const logos = [
    "",
    "",
    "",
    "",
  ];

  return (
    <section style={container} aria-label="Lender partners">
      {logos.map((src, i) => (
        <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #0a0f1c, #1c2a4a)", borderRadius: "8px" }} />
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
