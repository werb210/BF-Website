const STORAGE_KEY = "bf_pending_lead_v1";
const MAX_AGE = 1000 * 60 * 60 * 24; // 24h

export type PendingLead = {
  id: string;
  data: Record<string, unknown>;
  createdAt: number;
  retryCount: number;
};

function resolveStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("Storage unavailable during SSR");
  }

  return window.localStorage;
}

function resolveFallbackStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("Storage unavailable during SSR");
  }

  return window.sessionStorage;
}

export function saveLead(lead: PendingLead) {
  const serialized = JSON.stringify(lead);

  try {
    resolveStorage().setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("LEAD_STORAGE_WRITE_ERROR:", error);
    resolveFallbackStorage().setItem(STORAGE_KEY, serialized);
  }
}

export function getLead(): PendingLead | null {
  try {
    const raw =
      resolveStorage().getItem(STORAGE_KEY) ||
      resolveFallbackStorage().getItem(STORAGE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw) as PendingLead;

    if (!parsed?.id || !parsed?.data || !parsed?.createdAt) return null;

    if (Date.now() - parsed.createdAt > MAX_AGE) {
      clearLead();
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("LEAD_STORAGE_READ_ERROR:", error);
    return null;
  }
}

export function clearLead() {
  try {
    resolveStorage().removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("LEAD_STORAGE_CLEAR_ERROR:", error);
  }

  try {
    resolveFallbackStorage().removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("LEAD_SESSION_CLEAR_ERROR:", error);
  }
}
