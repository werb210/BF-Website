// BF_WEBSITE_v789_CONVERSATION_TOKEN
// BF-Server v789 answers POST /api/maya/escalate with { conversation_id,
// visitor_token } and requires the token as X-Conversation-Token on
//   GET  /api/public/conversation/:id/messages
//   POST /api/public/conversation/:id/message
// so a guessed or leaked conversation id is no longer enough to read or write a
// thread. The token lives in memory and in sessionStorage next to the id, so a
// reload in the same tab keeps the chat; it is never written to localStorage.
//
// Older servers return no token. Everything here then behaves exactly as
// before (no header is sent), so this is safe to ship ahead of the server.

export const CONVERSATION_STORAGE_KEY = "boreal_chat_conversation_v1";
export const CONVERSATION_TOKEN_HEADER = "X-Conversation-Token";
export const CHAT_SESSION_ENDED_MESSAGE = "Your chat session ended. Tap Talk to a human to start again.";

export type StoredConversation = { conversationId: string; token: string | null };

let memory: StoredConversation | null = null;

function storage(): Storage | null {
  try {
    return typeof window !== "undefined" && window.sessionStorage ? window.sessionStorage : null;
  } catch {
    return null;
  }
}

export function saveConversation(conversationId: string, token?: string | null): void {
  if (!conversationId) return;
  // A re-escalation into the same thread may come back without a token; keep
  // the one we already hold for that thread rather than dropping it.
  const keep = memory && memory.conversationId === conversationId ? memory.token : null;
  memory = { conversationId, token: token || keep || null };
  try {
    storage()?.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(memory));
  } catch {
    /* storage full or blocked - the in-memory copy still works */
  }
}

export function loadConversation(): StoredConversation | null {
  if (memory) return memory;
  try {
    const raw = storage()?.getItem(CONVERSATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConversation> | null;
    if (!parsed || typeof parsed.conversationId !== "string" || !parsed.conversationId) return null;
    memory = {
      conversationId: parsed.conversationId,
      token: typeof parsed.token === "string" && parsed.token ? parsed.token : null,
    };
    return memory;
  } catch {
    return null;
  }
}

export function getConversationToken(conversationId: string): string | null {
  const stored = loadConversation();
  return stored && stored.conversationId === conversationId ? stored.token : null;
}

export function clearConversation(): void {
  memory = null;
  try {
    storage()?.removeItem(CONVERSATION_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

// Headers for a public conversation call. Empty when no token is held, which
// is what an older server expects.
export function conversationHeaders(conversationId: string): Record<string, string> {
  const token = getConversationToken(conversationId);
  return token ? { [CONVERSATION_TOKEN_HEADER]: token } : {};
}

// True when the server refused the thread: the token is missing, expired or
// belongs to another conversation. The visitor has to start a new chat.
export function isSessionEndedError(err: unknown): boolean {
  const status = (err as { status?: unknown } | null)?.status;
  return status === 401 || status === 403;
}
