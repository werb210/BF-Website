import { buildWebSocketUrl } from "./buildWebSocketUrl";

export function createSafeWebSocket(path: string) {
  try {
    return new WebSocket(buildWebSocketUrl(path));
  } catch {
    throw new Error("SOCKET_INIT_FAILED");
  }
}

let socket: WebSocket | null = null;

export function getChatSocket(): WebSocket {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  try {
    socket = new WebSocket(buildWebSocketUrl("/ws/chat"));
    return socket;
  } catch {
    throw new Error("SOCKET_INIT_FAILED");
  }
}

export function clearChatSocket() {
  socket = null;
}
