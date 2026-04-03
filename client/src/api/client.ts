import { API_BASE } from "@/config/api";

export const apiClient = async (url, options = {}) => {
  return fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
};
