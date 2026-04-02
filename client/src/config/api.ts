import { getEnv } from "./env";

export function getApiUrl() {
  return getEnv().VITE_API_URL;
}
