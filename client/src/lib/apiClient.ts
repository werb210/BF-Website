export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function createOfflineResponse<T>(payload: unknown): T {
  const leadLikePayload = payload as { message?: string } | undefined;

  if (leadLikePayload && typeof leadLikePayload.message === "string") {
    return { reply: "Thanks for your message. Our team will follow up shortly." } as T;
  }

  return { leadId: `offline-${Date.now()}` } as T;
}

export async function apiPost<T>(_path: string, payload?: unknown): Promise<T> {
  return createOfflineResponse<T>(payload);
}

export async function apiGet<T>(_path: string): Promise<T> {
  return {} as T;
}
