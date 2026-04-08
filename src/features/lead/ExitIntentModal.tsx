import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import { APPLY_URL } from "@/config/links";

export default function ExitIntentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY < 0) {
        setOpen(true);
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <h2>Before You Go…</h2>
      <p>Want a quick capital assessment?</p>
      <button onClick={() => (window.location.href = APPLY_URL)}>Apply Now</button>
    </Modal>
  );
}
