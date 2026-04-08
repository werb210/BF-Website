import { useEffect } from "react";
import { CLIENT_APP_URL } from "@/config/links";

export default function Apply() {
  useEffect(() => {
    if (CLIENT_APP_URL) {
      window.location.href = CLIENT_APP_URL;
    }
  }, []);

  return null;
}
