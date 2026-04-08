import { apiFetch } from "./client";

export async function checkBackend() {
  try {
    await apiFetch("/health");
    return true;
  } catch {
    return false;
  }
}
