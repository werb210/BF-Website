import type { Server } from "http";
import { WebSocketServer } from "ws";

export function startChatServer(server: Server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws/chat",
  });

  wss.on("connection", (ws) => {
    ws.on("message", () => {
      ws.send(
        JSON.stringify({
          message: "Maya connected",
        }),
      );
    });
  });
}
