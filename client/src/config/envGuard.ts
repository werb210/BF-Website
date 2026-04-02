import { getEnv } from "@/config/env";

export function getApiBaseUrl() {
  return getEnv().VITE_API_URL;
}
