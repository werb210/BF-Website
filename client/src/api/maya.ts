import { apiClient } from "@/api/client";

const mayaEnabled = import.meta.env.VITE_MAYA_ENABLED === "true";

export const sendMayaMessage = (message) => {
  if (!mayaEnabled) return;

  return apiClient("/api/v1/maya/message", {
    method: "POST",
    body: JSON.stringify({ message })
  });
};
