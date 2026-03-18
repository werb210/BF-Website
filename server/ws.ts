import type { Server } from "http";
import { WebSocketServer } from "ws";

export function startChatServer(server: Server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws/chat",
  });

  wss.on("connection", (ws) => {
    ws.on("message", (raw) => {
      let messageType: string | undefined;
      try {
        const payload = JSON.parse(raw.toString()) as { type?: string };
        messageType = payload.type;
      } catch {
        messageType = undefined;
      }

      if (messageType === "staff_joined") {
        ws.send(
          JSON.stringify({
            type: "staff_joined",
            message: "Transferring you to a specialist…",
          }),
        );
        return;
      }

      ws.send(
        JSON.stringify({
          message: "Maya connected",
        }),
      );
    });
  });
}
