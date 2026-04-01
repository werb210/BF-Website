import { buildWebSocketUrl } from "./buildWebSocketUrl";

export function createSafeWebSocket(path: string) {
  return new WebSocket(buildWebSocketUrl(path));
}

let socket: WebSocket | null = null;

export function getChatSocket(): WebSocket {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  socket = new WebSocket(buildWebSocketUrl("/ws/chat"));
  return socket;
}

export function clearChatSocket() {
  socket = null;
}
