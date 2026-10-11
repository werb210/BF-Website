// BFW_BLOCK_v152_TALK_HUMAN_COPY_AND_ISSUE_ROUTE_v1 - Talk to a Human and
// Report an Issue go to BF-Server directly, so the widget is "configured" as
// long as there is an origin to call.
// BF_WEBSITE_v789_ONE_API_BASE - the origin comes from config/env.ts like every
// other server call. The unused escalateToHuman/reportIssue copies that lived
// here (services/mayaService.ts is the live path) are gone.
import { API_BASE_URL } from "@/config/env";

export function isMayaConfigured() {
  return Boolean(API_BASE_URL);
}

export function getMayaApiBase() {
  return API_BASE_URL;
}

export async function checkMayaHealth(signal?: AbortSignal): Promise<boolean> {
  if (!isMayaConfigured()) return false;
  try {
    const response = await fetch(`${getMayaApiBase()}/health`, { method: "GET", signal });
    return response.ok;
  } catch {
    return false;
  }
}
