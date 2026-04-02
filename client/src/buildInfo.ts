import { getEnv } from "@/config/env";

export const buildInfo = {
  timestamp: new Date().toISOString(),
  mode: getEnv().MODE,
};
