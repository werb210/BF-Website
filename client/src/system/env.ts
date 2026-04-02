import { ENV, assertEnv } from "@/config/env";

export function getValidatedApiUrl() {
  assertEnv();
  return ENV.API_URL;
}

export function validateEnv() {
  assertEnv();
}
