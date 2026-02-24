import type { CSSProperties, ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div style={overlay} role="dialog" aria-modal="true">
      <div style={container}>
        <button onClick={onClose} style={closeBtn} aria-label="Close modal">×</button>
        {children}
      </div>
    </div>
  );
}

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const container: CSSProperties = {
  position: "relative",
  background: "white",
  padding: 30,
  width: "90%",
  maxWidth: 700,
  borderRadius: 10,
  maxHeight: "90vh",
  overflowY: "auto",
};

const closeBtn: CSSProperties = {
  position: "absolute",
  top: 10,
  right: 15,
  border: "none",
  background: "none",
  fontSize: 22,
  cursor: "pointer",
};
