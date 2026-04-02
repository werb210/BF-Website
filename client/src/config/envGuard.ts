import { ENV, assertEnv } from "@/config/env";

export function getApiBaseUrl() {
  assertEnv();
  return ENV.API_URL;
}
