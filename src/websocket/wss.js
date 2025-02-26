import { WebSocketServer } from "ws";
import { sendMessage } from "../controllers/message-controller.js";

export const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("🟢 Novo cliente conectado");

  ws.on("message", (data) => sendMessage(data, wss));

  ws.on("close", () => console.log("🔴 Cliente desconectado"));
});
