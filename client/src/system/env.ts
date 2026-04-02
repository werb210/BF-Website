import { getEnv } from "@/config/env";

export function getValidatedApiUrl() {
  return getEnv().VITE_API_URL;
}

export function validateEnv() {
  getEnv();
}
