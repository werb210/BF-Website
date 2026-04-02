import { z } from "zod";

const schema = z.object({
  MODE: z.string(),
  VITE_API_URL: z.string().url(),
  VITE_SITE_URL: z.string().url().default("https://borealfinancial.ca"),
  VITE_GA_ID: z.string().optional(),
  VITE_MAYA_ENABLED: z.boolean().default(false),
  VITE_MAYA_WS_BASE: z.string().default(""),
});

let cached: z.infer<typeof schema> | null = null;

export function getEnv() {
  if (!cached) {
    cached = schema.parse({
      MODE: import.meta.env.MODE,
      VITE_API_URL:
        import.meta.env.VITE_API_URL ||
        (import.meta.env.MODE === "test" ? "http://localhost:3000" : undefined),
      VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
      VITE_GA_ID: import.meta.env.VITE_GA_ID,
      VITE_MAYA_ENABLED: import.meta.env.VITE_MAYA_ENABLED === "true",
      VITE_MAYA_WS_BASE: import.meta.env.VITE_MAYA_WS_BASE,
    });
  }

  return cached;
}
