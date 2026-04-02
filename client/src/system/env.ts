import { assertEnv } from "@/config/env";

export function getValidatedApiUrl() {
  assertEnv();
  return import.meta.env.VITE_API_URL;
}

export function validateEnv() {
  assertEnv();
}
