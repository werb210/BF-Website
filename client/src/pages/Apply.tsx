import { useEffect } from "react";
import { ENV } from "@/config/env";

export default function Apply() {
  useEffect(() => {
    window.location.href = ENV.CLIENT_APP_URL;
  }, []);

  return null;
}
